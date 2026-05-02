import modal
from fastapi import Request
from fastapi.responses import JSONResponse

app = modal.App("latex-converter")

image = (
    modal.Image.debian_slim(python_version="3.11")
    .run_commands("echo 'rebuild-v2'")  # ← この1行を追加
    .pip_install(
        "fastapi[standard]",
        "transformers==5.5.0",
        "torch",
        "torchvision",
        "accelerate",
        "peft",
        "pillow",
        "huggingface_hub",
        "qwen-vl-utils",
    )
)

@app.cls(
    gpu="A10G",
    image=image,
    timeout=120,
    scaledown_window=300,
    startup_timeout=600,
)
class LatexConverter:
    @modal.enter()
    def load_model(self):
        from transformers import AutoProcessor, Qwen2_5_VLForConditionalGeneration
        from peft import PeftModel
        import torch

        base_model_id = "Qwen/Qwen2.5-VL-7B-Instruct"
        lora_model_id = "icochan-web-service/latex-jp-model-v2"

        self.processor = AutoProcessor.from_pretrained(base_model_id)

        model = Qwen2_5_VLForConditionalGeneration.from_pretrained(
            base_model_id,
            torch_dtype="auto",
            device_map="auto",
            ignore_mismatched_sizes=True,
        )
        self.model = PeftModel.from_pretrained(model, lora_model_id)
        self.model.eval()

    @modal.fastapi_endpoint(method="POST")
    async def convert(self, request: Request):
        import base64
        from PIL import Image
        import io
        import torch

        SYSTEM_PROMPT = """あなたは数式OCRの専門家です。
画像に含まれる数式・テキストをLaTeXに変換してください。

ルール：
- 文中数式は$と$で囲む
- 別立て数式は\[ではなく，align*環境にする
- 問題は適宜section*,subsection*,subsubsection*を使う
- 日本語テキストはそのまま地の文として出力する
- ∴ ∵ などの記号はそのまま使う
- コンパイル可能なLaTeXのみ出力する
- コードブロックや説明文は不要、LaTeXコードだけを返す"""

        try:
            body = await request.json()
            image_b64 = body["image"]

            image_data = base64.b64decode(image_b64)
            image = Image.open(io.BytesIO(image_data)).convert("RGB")

            messages = [
                {
                    "role": "user",
                    "content": [
                        {"type": "image", "image": image},
                        {"type": "text", "text": SYSTEM_PROMPT},
                    ],
                }
            ]

            text = self.processor.apply_chat_template(
                messages, tokenize=False, add_generation_prompt=True
            )

            inputs = self.processor(
                text=[text],
                images=[image],
                return_tensors="pt",
            ).to(self.model.device)

            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_new_tokens=1024,
                    temperature=0.1,
                    do_sample=True,
                )

            input_len = inputs["input_ids"].shape[1]
            generated = outputs[0][input_len:]
            latex = self.processor.decode(generated, skip_special_tokens=True).strip()

            return JSONResponse({"latex": latex})

        except Exception as e:
            return JSONResponse({"error": str(e)}, status_code=500)
import gradio as gr
from PIL import Image
import io

def tryon(user_img_bytes, cloth_img_bytes):
    try:
        user_img = Image.open(io.BytesIO(user_img_bytes)).convert("RGB")
        cloth_img = Image.open(io.BytesIO(cloth_img_bytes)).convert("RGB")
        
        # Dummy merge example (overlay)
        user_img.paste(cloth_img.resize(user_img.size), (0, 0), cloth_img if cloth_img.mode == "RGBA" else None)
        return user_img
    except Exception as e:
        return f"Error: {str(e)}"

iface = gr.Interface(
    fn=tryon,
    inputs=[gr.Image(type="numpy", label="User Image"), gr.Image(type="numpy", label="Cloth Image")],
    outputs="image"
)

iface.launch(server_name="0.0.0.0", server_port=7860)

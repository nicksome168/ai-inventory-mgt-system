
import base64
import os

import requests

invoke_url = "https://ai.api.nvidia.com/v1/vlm/nvidia/neva-22b"

with open("/Users/nickchao/Downloads/test.jpg", "rb") as f:
    image_b64 = base64.b64encode(f.read()).decode()

headers = {
    "Authorization": f"Bearer {os.environ.get('NVIDIA_API_KEY')}",
    "Accept": "application/json"
}

payload = {
    "messages": [
        {
            "role": "user",
            "content": f'tell me what the object is inside the picture. Just answer the object itself <img src="data:image/jpg;base64,{image_b64}" />'
        }
    ],
    "max_tokens": 1024,
    "temperature": 0.20,
    "top_p": 0.70,
    "seed": 0,
}

response = requests.post(invoke_url, headers=headers, json=payload)


print(response.json())

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

ultima_distancia = None

def verificarSituacaoDistancia(valor_distancia):
    if valor_distancia <= 20:
        return "Obstáculo muito próximo"
    elif valor_distancia <= 50:
        return "Obstáculo próximo"
    else:
        return "Obstáculo a frente"

@app.get("/distancia/{valor_distancia}")
def verificarDistancia(valor_distancia: float):
    global ultima_distancia
    ultima_distancia = valor_distancia

    situacao = verificarSituacaoDistancia(valor_distancia)

    return {
        "valor_distancia": valor_distancia,
        "situacao": situacao
    }

@app.get("/ultima-distancia")
def obterUltimaDistancia():
    return {
        "valor_distancia": ultima_distancia
    }            

@app.get("/gerar-audio/{valor_distancia}")
def gerarAudio(valor_distancia: float):
    if valor_distancia <= 20:
        arquivo_audio = "audio_muito_proximo"
    elif valor_distancia <= 50:
        arquivo_audio = "audio_proximo"
    else:
        arquivo_audio = "audio_a_frente"

    caminho_audio = f"api/audio/{arquivo_audio}.mp3"    
    return FileResponse(
        caminho_audio,
        media_type="audio/mpeg"
    )

app.mount(
    "/", StaticFiles(directory="web", html=True), name="web"
)
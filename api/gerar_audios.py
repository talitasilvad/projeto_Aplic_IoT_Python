from gtts import gTTS

audios = {
    "audio_muito_proximo":"Cuidado, obstáculo muito próximo.",
    "audio_proximo":"Obstáculo próximo.",
    "audio_a_frente":"Obstáculo à frente."
}

for arquivo_audio, mensagem in audios.items():
    voz = gTTS(mensagem, lang="pt-BR")
    caminho_audio = f"api/audio/{arquivo_audio}.mp3"
    voz.save(caminho_audio)
    
    print(f"Áudio gerado: {caminho_audio}")
const btnIniciar = document.getElementById("btnIniciar")
const btnDesligar = document.getElementById("btnDesligar")

let sistemaAtivo = false
let ultimaSituacao =  null
let intervaloConsulta = null
let audioEmReproducao = false

btnIniciar.addEventListener("click", () =>{
    if(sistemaAtivo){
        return
    }

    sistemaAtivo = true
    btnIniciar.disabled = true
    btnDesligar.disabled = false

    consultarDistancia()
    intervaloConsulta = setInterval(consultarDistancia, 500)
})

btnDesligar.addEventListener("click", () =>{
    if(!sistemaAtivo){
        return
    }

    sistemaAtivo = false
    btnIniciar.disabled = false
    btnDesligar.disabled = true

    clearInterval(intervaloConsulta)
    intervaloConsulta = null
    ultimaSituacao = null
})


async function reproduzirAudio(distancia) {
    if(audioEmReproducao){
        return
    }

    try {
        audioEmReproducao = true
        const resposta = await fetch(
            `/gerar-audio/${distancia}`
        )

        const audio = await resposta.blob()
        const urlAudio = URL.createObjectURL(audio)
        const player = new Audio(urlAudio)      

        player.onended = () =>{
            audioEmReproducao = false
            URL.revokeObjectURL(urlAudio)
        }

        player.onerror = () =>{
            audioEmReproducao = false
            URL.revokeObjectURL(urlAudio)
        }

        await player.play()
    } catch (error) {
        console.error("Erro ao reproduzir áudio: ", error)
        audioEmReproducao = false
    }
        
}

async function consultarDistancia() {
    if(!sistemaAtivo){
        return
    }
    try {
        const resposta = await fetch("/ultima-distancia")
        const dados = await resposta.json()


        if(dados.valor_distancia === null || dados.valor_distancia === undefined){
            return
        }

        let situacaoAtual
        if (dados.valor_distancia <= 75){
            situacaoAtual = "Cuidado, obstáculo muito próximo"
        }         
        else if (dados.valor_distancia <= 95){
            situacaoAtual = "Obstáculo próximo"
        }          
        else{
            situacaoAtual = "Obstáculo à frente"
        }

        console.log("Situação detectada:", situacaoAtual)
        console.log("Última situação:", ultimaSituacao)
        console.log("Áudio em reprodução:", audioEmReproducao)

        if(situacaoAtual !== ultimaSituacao && !audioEmReproducao){
            ultimaSituacao = situacaoAtual
            reproduzirAudio(dados.valor_distancia)           
            console.log("Mudança de situação detectada!")
        }
        console.log("Distância recebida: ", dados.valor_distancia)
        console.log("Situação atual: ", situacaoAtual)
        console.log("Última situação: ", ultimaSituacao)
        
    } catch (error) {
        console.error("Erro ao consultar distância: ", error)
    }
    
}
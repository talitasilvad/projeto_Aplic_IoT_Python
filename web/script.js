const btnIniciar = document.getElementById("btnIniciar")
const btnDesligar = document.getElementById("btnDesligar")

let sistemaAtivo = false
let ultimaSituacao =  null
let intervaloConsulta = null

btnIniciar.addEventListener("click", () =>{
    if(sistemaAtivo){
        return
    }

    sistemaAtivo = true
    btnIniciar.disabled = true
    btnDesligar.disabled = false

    consultarDistancia()
    intervaloConsulta = setInterval(consultarDistancia, 1000)
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
    try {
        const resposta = await fetch(
            `/gerar-audio/${distancia}`
        )

        const audio = await resposta.blob()
        const urlAudio = URL.createObjectURL(audio)
        const player = new Audio(urlAudio)
        
        player.play()
    } catch (error) {
        console.error("Erro ao reproduzir áudio: ", error)
    }
        
}

async function consultarDistancia() {
    if(!sistemaAtivo){
        return
    }
    try {
        const resposta = await fetch("/ultima-distancia")
        const dados = await resposta.json()

        let situacaoAtual
        if (dados.valor_distancia <= 20){
            situacaoAtual = "Obstáculo muito próximo"
        }         
        else if (dados.valor_distancia <= 50){
            situacaoAtual = "Obstáculo próximo"
        }          
        else{
            situacaoAtual = "Obstáculo a frente"
        }

        if(situacaoAtual !== ultimaSituacao){
            reproduzirAudio(dados.valor_distancia)
            ultimaSituacao = situacaoAtual
        }
        
    } catch (error) {
        console.error("Erro ao consultar distância: ", error)
    }
    
}
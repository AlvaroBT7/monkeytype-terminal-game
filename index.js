class MonkeyError extends Error {
  constructor({ message, timer }) {
    super();
    this.name = "MonkeyError";
    this.timer = timer || 0;
    this.message = message || this.name;
  }
}

class ExitMonkeyError extends Error {}

async function askPhrases() {
  let timer = 0;
  const interval = setInterval(() => timer++, 1);
  const phrases = `El sol brilla en el cielo azul.
  El gato negro corre rápido.
  Me gusta comer pizza los viernes.
  Hoy es un dia soleado y caluroso.
  El perro ladra fuerte en el parque.
  Mi mama cocina delicioso.
  El libro rojo está sobre la mesa.
  Estoy feliz de verte aqui.
  La musica suena suavemente en el fondo.
  Me gusta mucho el helado de chocolate.
  El agua fresca es muy refrescante.
  Mi hermano menor juega al fútbol.
  El arbol alto da sombra en el parque.
  Mi abuela cocina deliciosas galletas.
  La playa es un lugar perfecto para relajarse.
  El niño rie cuando ve un payaso.
  El lapiz negro escribe muy suavemente.
  Me encanta leer libros de aventuras.
  El bebe duerme placidamente en su cuna.
  El jugo de naranja es mi favorito.`
    .split(".")
    .map((eachPhrase) => eachPhrase.trim());
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  console.log(phrase);

  const result = await new Promise((resolve, reject) => {
    process.stdin.on("data", (content, error) => {
      const phraseToString = content.toString().trim();
      if (phraseToString === "exit") {
        reject(new ExitMonkeyError());
      }

      if (error) reject(error);
      else {
        const phraseIsCorrect = phraseToString.toString().trim() === phrase;
        if (phraseIsCorrect)
          resolve((phrase.split().length / timer) * 1000 * 60);
        else
          reject(
            new MonkeyError({
              message: "Phrase is not correct",
              timer,
            })
          );
      }
      clearInterval(interval);
    });
  });
  return result;
}

async function monkeyType(times) {
  console.log("--===+ TypeMonkey +===--");
  console.log(`You have ${times} atempts to type. Press [exit]  to leave.`);
  const attempts = [];
  while (times) {
    try {
      console.log(`
      `);
      const result = new Number((await askPhrases()).toFixed(2));
      console.log(`You tipped ${result} WPM`);
      attempts.push(result);
    } catch (error) {
      if (error instanceof MonkeyError && !(error instanceof ExitMonkeyError)) {
        console.error(error.message);
        attempts.push(0);
      } else {
        throw error;
      }
    } finally {
      times--;
    }
  }
  console.log(`
  `);
  console.log(`Your attempts: [${attempts}]`);
  let totalAttempts = 0;
  attempts.forEach((attemp) => (totalAttempts += attemp));
  return `You have a average of ${totalAttempts / attempts.length} WPM`;
}

monkeyType(3)
  .then((result) => {
    console.log(result);
    console.log("");
    console.log(`Press [Control] + [C] to exit`);
  })
  .catch((error) => {
    process.stdin.pause();
    console.error(error);
  });

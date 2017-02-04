import { Game } from "./core";
import { Bubble } from "./bubble";
import { getPowerups } from "./powerup";

export class PowerupManager {
    registerdPowerups: any[] = [];
    selectedPowerups: any[] = [];

    constructor(private game: Game) {
    }

    RegisterPowerupType(p: any) {
        // let test = new p();
        // if (test.image) {
            this.registerdPowerups.push(p);
            // TODO: Local storage on node
            this.selectedPowerups.push(p);
            /*if (localStorage[name] !== "disabled") {
                selectedPowerups.push(name);
            }*/
        // }
    }

    ReigisterPowerups() {
        let powerup = getPowerups();
        for (let p in powerup) {
            this.RegisterPowerupType(powerup[p]);
        }
    }

    GetRandomPowerup(bubble: Bubble) {
        let name = this.selectedPowerups[Math.floor(Math.random() * this.selectedPowerups.length)];
        return {name: name, powerup: new name(bubble, this.game)};
    }

    CreatePowerupByName(name: string, bubble: Bubble) {
        /*console.log(name);
        return {name: name, powerup: new powerup[name](bubble, this.game)}*/
    }
}



import Card from '../helper/card'
import { store } from '../../index'

export default class Stage1Eventgame extends Phaser.Scene { // 다람쥐 도토리 줍기 미니게임
  private lifeText!: Phaser.GameObjects.BitmapText
  private attempt!: Phaser.GameObjects.BitmapText
  private matched!: Phaser.GameObjects.BitmapText
  private bonus!: number
  private score!: Phaser.GameObjects.BitmapText
  private cards: Card[] = []
  private selectedCards: Card[] = []
  private attempts: number = 0
  private waitForNewRound: Boolean = false
  private images: Object = {
    "back.png": "b9a80f88810fc29b34f58e235214e144.png",
    "card1.png": "9bcf0b24503994316476c7c003e5222f.png",
    "card2.png": "4a9bbf837385923213b414f3535e4037.png",
    "card3.png": "c51db3d76ce12d85f6f71344aaa93fce.png",
    "card4.png": "6b48715741c7f18fe74e7c66b8f1f49d.png",
    "card5.png": "f5ffa19121a0bb258401d2700c05d202.png",
    "card6.png": "5e2b9c97ed48a517c6d111583d110106.png",
    "card7.png": "af02febc13262ff971680447e93e31b8.png",
    "card8.png": "2f9853ca3389e87936ed37d1b076bd01.png",
    "front.png": "7ab6fa294abdb99329c00176e38eab0d.png"
  }

  constructor() {
    super('Stage1Eventgame')
  }

  public init(data: any) {
    this.registry.set('score', data.score) // 이전 scene에서 올라온 데이터 등록
    this.registry.set('life', data.life)
    this.registry.set('stage', data.stage)
    this.registry.set('bird', data.bird)
    this.registry.set('squi', data.squi)
    this.registry.set('time', 30)
    this.registry.set('recovery', 0)
  }

  preload(): void {
    this.sound.add('stage1-2_bgm').play({
      loop: true
    }) // 노래 재생하기

    this.newRound()
  }

  public create(): void {

    // store.dispatch({
    //   type: 'MUTE_MULTI_GAME'
    // })
    
    // if(store.getState().gameReducer.multi > 1) {
    //   this.game.sound.mute = true
    //   this.input.enabled = false
    // }

    // if(store.getState().gameReducer.multi === 4) {
    //   store.dispatch({
    //     type: 'MUTE_MULTI_GAME_RESET'
    //   })
    // }

    // this.input.enabled = false

    this.add.graphics()
    .lineStyle(10, 0x5ce0e6)
    .fillStyle(0xffffff, 100) // 배경색, 투명도
    .strokeRoundedRect(70, 100, 250, 80, 10)
    .fillRoundedRect(70, 100, 250, 80, 10)
    .setDepth(5)

    this.add.graphics()
    .lineStyle(10, 0x5ce0e6)
    .fillStyle(0xffffff, 100) // 배경색, 투명도
    .strokeRoundedRect(870, 100, 300, 210, 10)
    .fillRoundedRect(870, 100, 300, 210, 10)
    .setDepth(5)

    this.add.image(0, 0, 'cardbg').setOrigin(0, 0).setDepth(0)
    this.lifeText = this.add // 라이프 텍스트 생성
      .bitmapText(90, 125, 'font', `TIMER ${this.registry.values.time}`)
      .setDepth(6)

    this.time.addEvent({ // 게임에서 시간 이벤트 등록, 1초당 콜백 호출 (콜백내용은 초당 체력 감소)
      delay: 1000,
      callback: this.worldTime,
      callbackScope: this,
      loop: true,
    })

    this.time.addEvent({ // 게임에서 시간 이벤트 등록, 1초당 콜백 호출 (콜백내용은 초당 체력 감소)
      delay: 900,
      callback: this.finalStage,
      callbackScope: this,
      loop: true,
    })

    this.attempt = this.add
    .bitmapText(890, 125, 'font',`ATTEMPT ${this.attempts}`)
    .setDepth(6)

    this.matched = this.add
    .bitmapText(890, 175, 'font',`MATCHED ${this.matchedCards()}`)
    .setDepth(6)

    this.score= this.add
    .bitmapText(890, 250, 'font',`SCORE ${this.matchedCards() * 100}`)
    .setDepth(6)

    const MAX_CARD_LINE = 4
    const PAIRS = 8
    const xLevel = 120
    const yLevel = 130
    const xInit = 425
    const yInit = 117
    const lines = 4

    const numberOfCards = PAIRS * 2
    const positions = []

    const imageNames = Object.keys(this.images).filter((name) => {
      return name.includes('card')
    }).slice(0, PAIRS)

    let total = numberOfCards

    for (let line = 0; line < lines; line++) {
      for (let pos = 0; pos < MAX_CARD_LINE; pos++) {
        if (total > 0) {
          positions.push({
            x: xInit + (xLevel * pos),
            y: yInit + (yLevel * line)
          })
        }
        total--
      }
    }
    
    while (positions.length) {
      const posA = positions.splice(this.getRandomInt(positions.length), 1)[0]
      const posB = positions.splice(this.getRandomInt(positions.length), 1)[0]
      const key = imageNames.splice(this.getRandomInt(imageNames.length), 1)[0]

      this.cards.push(new Card({ key, gameScene: this, ...posA, handler: this.cardClickHandler.bind(this) }))
      this.cards.push(new Card({ key, gameScene: this, ...posB, handler: this.cardClickHandler.bind(this) }))
    }
    // const image = this.add.image(1800, 300, 'stage2')
    // this.tweens.add({
    //   targets: image,
    //   x: 100,
    //   ease: 'Sine.easeInOut',
    //   yoyo: true,
    //   repeat: -1,
    //   duration: 3000
    // });
    // this.cameras.main.once('camerafadeincomplete', function (camera) {
    //   camera.fadeOut(6000);
    // });
    this.bonus = this.matchedCards()
  }

  public update(): void {
    if(this.matchedCards() === 8) {
      this.bonus = this.matchedCards()
      this.matched.setTintFill(0x00FF00)
      setTimeout(() => this.matched.clearTint(), 150)
      this.matched.setText(`MATCHED ${this.matchedCards()}`)
      this.score.setTintFill(0x00FF00)
      setTimeout(() => this.score.clearTint(), 150)
      this.score.setText(`SCORE ${5000}`)
      setTimeout(() => this.matched.clearTint(), 150)
      setTimeout(() => this.score.clearTint(), 150)
    }
    else if(this.bonus !== this.matchedCards()) {
      this.bonus = this.matchedCards()
      this.matched.setTintFill(0x00FF00)
      setTimeout(() => this.matched.clearTint(), 150)
      this.matched.setText(`MATCHED ${this.matchedCards()}`)
      this.score.setTintFill(0x00FF00)
      setTimeout(() => this.score.clearTint(), 150)
      this.score.setText(`SCORE ${this.matchedCards() * 200}`)
    }

  }

  private worldTime(): void {  // 1초당 실행되는 함수 this.worldTimer 참조
    this.registry.values.time -= 1
    this.lifeText.setText(`TIMER ${this.registry.values.time}`)
    if (this.registry.values.time === 0) {
      // 30초 지난 후 콜백 실행
      this.game.sound.stopAll()
      this.time.addEvent({
        delay: 500,
        callback: () => this.scene.start('Stage2', {
          score: this.registry.values.score + (this.matchedCards() * 200),
          life: this.registry.values.life,
          stage: 2,
          bird: this.registry.values.bird,
          squi: this.registry.values.squi
        }),
        callbackScope: this,
        loop: true,
      })
    }
  }

  private newRound(): void {
    this.waitForNewRound = true
    setTimeout(() => {
      if (this.matchCards()) {
        this.setAsReadOnly()
      } else {
        this.faceCardsDown()
      }
      this.updateScore()
      this.selectedCards.length = 0
      this.waitForNewRound = false
      this.attempts++
    }, 1500)
  }

  private matchedCards(): number {
    return this.cards.filter((card) => card.outOfTheGame).length / 2
  }

  private updateScore() {
    // var style = { font: 'bold 20px Arial', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle' }

    // this.lifeText = this.add // 라이프 텍스트 생성
    //   .bitmapText(30, 30, 'font', `남은 시간 ${this.registry.values.time}`)
    //   .setDepth(6)

    // if (!this.score) {

      this.attempt.setText(`ATTEMPT ${this.attempts}`)


    // }
    // this.score.text = `
    //   시도 : ${this.attempts}
    //   맞춘 카드 : ${this.matchedCards()}
    //   체력 회복 : ${this.matchedCards() * 100} 포인트
    // `;
  }

  private cardClickHandler(card: any) {
    if (this.waitForNewRound) return
    card.faceUp()
    this.selectedCards.push(card)
    if (this.selectedCards.length === 2) {
      this.waitForNewRound = true
      this.newRound()
    }
  }

  private setAsReadOnly() {
    this.selectedCards.forEach((card) => card.readOnly())
  }

  private faceCardsDown() {
    this.selectedCards.forEach((card) => card.faceDown())
    this.waitForNewRound = false
  }

  private matchCards() {
    if (!this.selectedCards.length) return
    const cardA = this.selectedCards[0]
    const cardB = this.selectedCards[1]
    return cardA.key === cardB.key
  }

  private getRandomInt = (max: number) => {
    return Math.floor(Math.random() * Math.floor(max))
  }

  private finalStage(): void {
    if (this.registry.values.time <= 10) {
      this.lifeText.setTintFill(0xFF7F50)
      this.time.addEvent({
        delay: 450,
        callback: () => this.lifeText.clearTint(),
        callbackScope: this,
        loop: false
      })
    }
  }
}


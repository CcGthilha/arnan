import dogImg from './assets/dog.jpg'
import { useState, useRef, useEffect } from 'react'
import './App.css'

/* ---------- Inline icons (no emoji) ---------- */
const IconImage = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="9" width="36" height="30" rx="5" />
    <circle cx="17" cy="19" r="3.5" />
    <path d="M42 30 L31 21 L18 32 L12 27 L6 33" />
  </svg>
)

const IconHeart = () => (
  <svg viewBox="0 0 48 48" fill="currentColor">
    <path d="M24 42 C10 32 4 23 4 15.5 C4 8.6 9.4 4 16 4 C20 4 22.8 6.3 24 9 C25.2 6.3 28 4 32 4 C38.6 4 44 8.6 44 15.5 C44 23 38 32 24 42 Z" />
  </svg>
)

const IconSparkle = () => (
  <svg viewBox="0 0 48 48" fill="currentColor">
    <path d="M22 2 L26 18 L42 22 L26 26 L22 42 L18 26 L2 22 L18 18 Z" />
  </svg>
)

const IconEnvelope = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="38" height="27" rx="4" />
    <path d="M6 13 L24 28 L42 13" />
  </svg>
)

/* ---------- Small reusable meme slot (every page) ---------- */
function DogMeme({ caption, src }) {
  return (
    <div className="meme-thumb">
      {src ? (
        <img src={src} alt={caption || 'มีมหมา'} className="meme-img" />
      ) : (
        <>
          <IconImage />
          <span>ใส่มีมหมาตรงนี้{caption ? ` \u00b7 ${caption}` : ''}</span>
        </>
      )}
    </div>
  )
}

/* ---------- Chase pair: negative button dodges, positive grows ---------- */
function ChasePair({ agreeLabel, denyLabel, onAgree, containerRef }) {
  const [pos, setPos] = useState({ left: null, top: null })
  const [hits, setHits] = useState(0)
  const scale = 1 + hits * 0.15

  const dodge = () => {
    const el = containerRef.current
    if (!el) return
    const b = el.getBoundingClientRect()
    const btnW = 128
    const btnH = 44
    const maxLeft = Math.max(0, b.width - btnW)
    const maxTop = Math.max(0, b.height - btnH)
    setPos({
      left: Math.max(4, Math.random() * maxLeft),
      top: Math.max(4, Math.random() * maxTop),
    })
    setHits((h) => h + 1)
  }

  return (
    <div className="btn-row">
      <button className="agree-btn" style={{ transform: `scale(${scale})` }} onClick={onAgree}>
        {agreeLabel}
      </button>
      <button
        className="deny-btn"
        style={pos.left !== null ? { position: 'absolute', left: pos.left, top: pos.top } : undefined}
        onMouseEnter={dodge}
        onClick={dodge}
      >
        {denyLabel}
      </button>
    </div>
  )
}

/* ---------- Plain two-choice (both clickable, real branch) ---------- */
function PlainChoice({ leftLabel, rightLabel, onLeft, onRight }) {
  return (
    <div className="btn-row">
      <button className="agree-btn" onClick={onLeft}>{leftLabel}</button>
      <button className="deny-btn static" onClick={onRight}>{rightLabel}</button>
    </div>
  )
}

/* ================= Screens ================= */

function Landing({ onYes }) {
  const cardRef = useRef(null)
  return (
    <div className="card" ref={cardRef}>
      <div className="photo-frame">
        <div className="photo-placeholder">
          <img src={dogImg} alt="หมา" className="meme-img" />
        </div>
        <span className="tape tape-left" />
        <span className="tape tape-right" />
      </div>

      <h1>ต๊ะเอ๋ นอยเค้าหรอ</h1>
      <p className="msg">ตอบมาตามตรงเลยนะ</p>

      <ChasePair agreeLabel="ใช่" denyLabel="ไม่" containerRef={cardRef} onAgree={onYes} />
    </div>
  )
}

function AskKnow({ onNext }) {
  const cardRef = useRef(null)
  return (
    <div className="card" ref={cardRef}>
      <DogMeme caption="ทำหน้าลึกลับ" />
      <h1>บลูมีไรจะให้แหละ</h1>
      <p className="msg">ไหนๆ คุณอยากรู้มั้ยอะไร</p>
      <ChasePair agreeLabel="อยากรู้" denyLabel="ไม่อยากรู้" containerRef={cardRef} onAgree={onNext} />
    </div>
  )
}

function HeartOffer({ onTake, onSkip }) {
  return (
    <div className="card">
      <div className="heart-float">
        <IconHeart />
      </div>
      <h1>หัวใจของน้องบลูไง</h1>
      <p className="msg">คุณเอามั้ย ให้ฟรีเลยนะ</p>
      <PlainChoice leftLabel="เอา" rightLabel="ไม่เอา" onLeft={onTake} onRight={onSkip} />
    </div>
  )
}

function AcceptContinue({ onNext }) {
  return (
    <div className="card">
      <DogMeme caption="ยิ้มกริ่ม" />
      <h1>รับไว้นะ</h1>
      <button className="agree-btn wide" onClick={onNext}>ไปกันต่อ</button>
    </div>
  )
}

function RefuseReoffer({ onTaken }) {
  const cardRef = useRef(null)
  return (
    <div className="card" ref={cardRef}>
      <DogMeme caption="ยื่นให้อีกรอบ" />
      <h1>เอาไปเถอะ</h1>
      <p className="msg">ให้ฟรีเลยนะ รอบนี้หนีไม่ได้แล้ว</p>
      <ChasePair agreeLabel="เอา" denyLabel="ไม่เอา" containerRef={cardRef} onAgree={onTaken} />
    </div>
  )
}

function ForcedAccept({ onNext }) {
  return (
    <div className="card">
      <DogMeme caption="ดีใจ" />
      <h1>เย่</h1>
      <button className="agree-btn wide" onClick={onNext}>ไปกันต่อ</button>
    </div>
  )
}

function Letter({ onAgreeMakeUp }) {
  const [open, setOpen] = useState(false)
  const cardRef = useRef(null)
  return (
    <div className="card" ref={cardRef}>
      <DogMeme caption="นั่งรอเขิน ๆ" />
      {!open ? (
        <>
          <div className="envelope">
            <IconEnvelope />
          </div>
          <h1>มีจดหมายมาส่ง</h1>
          <button className="agree-btn wide" onClick={() => setOpen(true)}>เปิด</button>
        </>
      ) : (
        <>
          <p className="letter-text">
            โอ๋ ๆ คนสวย หายนอยบลูนะ บลูเป็นเด็กดื้อใช่มั้ย เดี๋ยวตีให้เลยนะ
            นี่แหนะ ๆ ไอ้บ้านี่ คุณอยากทำแบบนี้ใช่มั้ย เห็นบอกจะตีเราบ่อยมาก
            เราตีตัวเองให้คุณแล้ว หายนอยน้าา ดีกันน้า ดีมั้ย
          </p>
          <ChasePair agreeLabel="ดีกัน" denyLabel="ไม่ดี" containerRef={cardRef} onAgree={onAgreeMakeUp} />
        </>
      )}
    </div>
  )
}

function ConfirmMakeUp({ onYes, onNo }) {
  return (
    <div className="card">
      <DogMeme caption="เอียงคอถาม" />
      <h1>เย่ ดีกันแล้วใช่ม้ายยยยยยย</h1>
      <PlainChoice leftLabel="ใช่" rightLabel="ไม่" onLeft={onYes} onRight={onNo} />
    </div>
  )
}

function MakeUpNoRetry({ onAgreed }) {
  const cardRef = useRef(null)
  return (
    <div className="card" ref={cardRef}>
      <DogMeme caption="ทำตาแป๋ว" />
      <h1>ฮืออ ดีกันได้แล้วมั้ง</h1>
      <p className="msg">คิดถึงคุณแล้วเนี่ย</p>
      <ChasePair agreeLabel="ดีกัน" denyLabel="ไม่ดี" containerRef={cardRef} onAgree={onAgreed} />
    </div>
  )
}

function MakeUpYes({ onNext }) {
  return (
    <div className="card">
      <DogMeme caption="งอแง้งอแง" />
      <h1>งืมม ดีกันแล้ว</h1>
      <p className="msg">สุดท้ายละ ๆ เค้าอยากจะบอกเธอว่า...</p>
      <button className="agree-btn wide" onClick={onNext}>ไปกันต่อ</button>
    </div>
  )
}

function Final() {
  return (
    <div className="card win">
      <DogMeme caption="นอนขดข้าง ๆ" />
      <div className="win-icon-row">
        <IconHeart />
        <IconSparkle />
      </div>
      <h1>ขอบคุณที่เป็นรอยยิ้มให้กันในทุกวัน</h1>
      <p className="msg">ชอบเธอมากกว่าเมื่อวาน แต่น้อยกว่าพรุ่งนี้แน่นอน</p>
    </div>
  )
}

/* ================= App (step machine) ================= */

const STEPS = {
  LANDING: 'landing',
  ASK_KNOW: 'ask-know',
  HEART_OFFER: 'heart-offer',
  ACCEPT_CONTINUE: 'accept-continue',
  REFUSE_REOFFER: 'refuse-reoffer',
  FORCED_ACCEPT: 'forced-accept',
  LETTER: 'letter',
  CONFIRM_MAKEUP: 'confirm-makeup',
  MAKEUP_NO_RETRY: 'makeup-no-retry',
  MAKEUP_YES: 'makeup-yes',
  FINAL: 'final',
}

function App() {
  const [step, setStep] = useState(STEPS.LANDING)

  useEffect(() => {
    document.title = 'anna noi jai rai kub'
  }, [])

  return (
    <div className="wrap">
      {step === STEPS.LANDING && <Landing onYes={() => setStep(STEPS.ASK_KNOW)} />}
      {step === STEPS.ASK_KNOW && <AskKnow onNext={() => setStep(STEPS.HEART_OFFER)} />}
      {step === STEPS.HEART_OFFER && (
        <HeartOffer
          onTake={() => setStep(STEPS.ACCEPT_CONTINUE)}
          onSkip={() => setStep(STEPS.REFUSE_REOFFER)}
        />
      )}
      {step === STEPS.ACCEPT_CONTINUE && <AcceptContinue onNext={() => setStep(STEPS.LETTER)} />}
      {step === STEPS.REFUSE_REOFFER && (
        <RefuseReoffer onTaken={() => setStep(STEPS.FORCED_ACCEPT)} />
      )}
      {step === STEPS.FORCED_ACCEPT && <ForcedAccept onNext={() => setStep(STEPS.LETTER)} />}
      {step === STEPS.LETTER && (
        <Letter onAgreeMakeUp={() => setStep(STEPS.CONFIRM_MAKEUP)} />
      )}
      {step === STEPS.CONFIRM_MAKEUP && (
        <ConfirmMakeUp
          onYes={() => setStep(STEPS.MAKEUP_YES)}
          onNo={() => setStep(STEPS.MAKEUP_NO_RETRY)}
        />
      )}
      {step === STEPS.MAKEUP_NO_RETRY && (
        <MakeUpNoRetry onAgreed={() => setStep(STEPS.MAKEUP_YES)} />
      )}
      {step === STEPS.MAKEUP_YES && <MakeUpYes onNext={() => setStep(STEPS.FINAL)} />}
      {step === STEPS.FINAL && <Final />}
    </div>
  )
}

export default App
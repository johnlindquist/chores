import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChoreDisplay, sampleKids, sampleDate, sampleQuote } from "../components/ChoreDisplay";

const meta: Meta<typeof ChoreDisplay> = {
  title: "TRMNL/ChoreDisplay",
  component: ChoreDisplay,
  parameters: { layout: "centered", backgrounds: { default: "gray", values: [{ name: "gray", value: "#888" }] } },
  args: { date: sampleDate, kids: sampleKids, benQuote: sampleQuote },
};
export default meta;
type Story = StoryObj<typeof ChoreDisplay>;

// 11. ART DECO - 1920s geometric elegance
export const ArtDeco: Story = {
  render: ({ date, kids, benQuote }) => (
    <ChoreDisplay date={date} kids={kids} benQuote={benQuote}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poiret+One&family=Josefin+Sans:wght@300;600&display=swap');
        .deco { font-family: 'Josefin Sans', sans-serif; background: #fff; height: 100%; padding: 18px; box-sizing: border-box; position: relative; }
        .deco::before { content: ''; position: absolute; top: 8px; left: 8px; right: 8px; bottom: 8px; border: 3px solid #000; pointer-events: none; }
        .deco::after { content: ''; position: absolute; top: 14px; left: 14px; right: 14px; bottom: 14px; border: 1px solid #000; pointer-events: none; }
        .deco-header { text-align: center; padding: 8px 0 16px; }
        .deco-title { font-family: 'Poiret One', cursive; font-size: 44px; letter-spacing: 16px; text-transform: uppercase; }
        .deco-date { font-size: 12px; letter-spacing: 5px; text-transform: uppercase; font-weight: 300; }
        .deco-divider { height: 16px; background: repeating-linear-gradient(90deg, #000 0px, #000 2px, transparent 2px, transparent 18px); margin: 0 36px 16px; }
        .deco-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; padding: 0 36px; }
        .deco-kid { position: relative; padding: 14px; text-align: center; }
        .deco-kid::before { content: '◆'; position: absolute; top: -4px; left: 50%; transform: translateX(-50%); font-size: 8px; }
        .deco-name { font-family: 'Poiret One', cursive; font-size: 24px; letter-spacing: 3px; border-bottom: 1px solid #000; padding-bottom: 6px; margin-bottom: 8px; }
        .deco-chore { font-size: 13px; font-weight: 300; padding: 3px 0; letter-spacing: 1px; }
        .deco-quote { position: absolute; bottom: 22px; left: 50%; transform: translateX(-50%); font-style: italic; font-size: 12px; letter-spacing: 2px; }
      `}</style>
      <div className="deco">
        <div className="deco-header">
          <div className="deco-title">Chores</div>
          <div className="deco-date">{date}</div>
        </div>
        <div className="deco-divider" />
        <div className="deco-grid">
          {kids.map((kid) => (
            <div key={kid.name} className="deco-kid">
              <div className="deco-name">{kid.name}</div>
              {kid.chores.map((chore, i) => (<div key={i} className="deco-chore">{chore}</div>))}
            </div>
          ))}
        </div>
        {benQuote && (<div className="deco-quote">— Ben says: "{benQuote}" —</div>)}
      </div>
    </ChoreDisplay>
  ),
};

// 12. PIXEL - 8-bit game style
export const Pixel: Story = {
  render: ({ date, kids, benQuote }) => (
    <ChoreDisplay date={date} kids={kids} benQuote={benQuote} style={{ background: "#111" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        .pixel { font-family: 'Press Start 2P', monospace; background: #111; color: #fff; height: 100%; padding: 18px; box-sizing: border-box; }
        .pixel-header { text-align: center; margin-bottom: 18px; padding-bottom: 14px; border-bottom: 4px solid #fff; }
        .pixel-title { font-size: 22px; letter-spacing: 3px; }
        .pixel-date { font-size: 9px; margin-top: 10px; opacity: 0.7; }
        .pixel-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        .pixel-kid { background: #222; border: 3px solid #fff; padding: 10px; }
        .pixel-name { font-size: 11px; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 2px dashed #666; }
        .pixel-name::before { content: '> '; opacity: 0.5; }
        .pixel-chore { font-size: 7px; padding: 4px 0; }
        .pixel-chore::before { content: '▶ '; }
        .pixel-quote { position: absolute; bottom: 14px; left: 18px; right: 18px; text-align: center; font-size: 7px; border-top: 2px solid #fff; padding-top: 10px; }
      `}</style>
      <div className="pixel">
        <div className="pixel-header">
          <div className="pixel-title">CHORE QUEST</div>
          <div className="pixel-date">{date}</div>
        </div>
        <div className="pixel-grid">
          {kids.map((kid) => (
            <div key={kid.name} className="pixel-kid">
              <div className="pixel-name">PLAYER: {kid.name.toUpperCase()}</div>
              {kid.chores.map((chore, i) => (<div key={i} className="pixel-chore">{chore}</div>))}
            </div>
          ))}
        </div>
        {benQuote && (<div className="pixel-quote">♥ ♥ ♥ BEN: "{benQuote}" ♥ ♥ ♥</div>)}
      </div>
    </ChoreDisplay>
  ),
};

// 13. ELEGANT SCRIPT - Calligraphy style
export const ElegantScript: Story = {
  render: ({ date, kids, benQuote }) => (
    <ChoreDisplay date={date} kids={kids} benQuote={benQuote}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Crimson+Pro:wght@300;500&display=swap');
        .script { font-family: 'Crimson Pro', serif; background: #fff; height: 100%; padding: 28px 44px; box-sizing: border-box; position: relative; }
        .script::before { content: ''; position: absolute; top: 18px; left: 18px; right: 18px; bottom: 18px; border: 1px solid #ccc; pointer-events: none; }
        .script-header { text-align: center; margin-bottom: 28px; }
        .script-title { font-family: 'Pinyon Script', cursive; font-size: 58px; }
        .script-date { font-size: 12px; font-weight: 300; letter-spacing: 5px; text-transform: uppercase; color: #666; margin-top: -6px; }
        .script-ornament { text-align: center; font-size: 16px; color: #999; margin: 14px 0; letter-spacing: 6px; }
        .script-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px; }
        .script-kid { text-align: center; }
        .script-name { font-family: 'Pinyon Script', cursive; font-size: 32px; margin-bottom: 10px; }
        .script-chore { font-size: 13px; font-weight: 300; padding: 5px 0; border-bottom: 1px solid #eee; }
        .script-chore:last-child { border-bottom: none; }
        .script-quote { position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); font-family: 'Pinyon Script', cursive; font-size: 22px; color: #666; }
      `}</style>
      <div className="script">
        <div className="script-header">
          <div className="script-title">Today's Tasks</div>
          <div className="script-date">{date}</div>
        </div>
        <div className="script-ornament">❧ ❧ ❧</div>
        <div className="script-grid">
          {kids.map((kid) => (
            <div key={kid.name} className="script-kid">
              <div className="script-name">{kid.name}</div>
              {kid.chores.map((chore, i) => (<div key={i} className="script-chore">{chore}</div>))}
            </div>
          ))}
        </div>
        {benQuote && (<div className="script-quote">~ {benQuote} ~</div>)}
      </div>
    </ChoreDisplay>
  ),
};

// 14. POSTCARD - Vintage mail
export const Postcard: Story = {
  render: ({ date, kids, benQuote }) => (
    <ChoreDisplay date={date} kids={kids} benQuote={benQuote}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Lora:wght@400;600&display=swap');
        .post { font-family: 'Lora', serif; background: #fff; height: 100%; padding: 20px; box-sizing: border-box; position: relative; }
        .post-stamp { position: absolute; top: 16px; right: 20px; width: 70px; height: 90px; background: #fff; border: 4px dashed #999; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .post-stamp-text { font-family: 'Archivo Black', sans-serif; font-size: 9px; text-transform: uppercase; letter-spacing: 1px; }
        .post-stamp-value { font-family: 'Archivo Black', sans-serif; font-size: 22px; }
        .post-header { max-width: 580px; margin-bottom: 20px; }
        .post-title { font-family: 'Archivo Black', sans-serif; font-size: 32px; text-transform: uppercase; letter-spacing: 3px; }
        .post-date { font-size: 13px; color: #666; margin-top: 3px; }
        .post-divider { height: 3px; background: repeating-linear-gradient(90deg, #000 0px, #000 10px, #666 10px, #666 20px); margin: 14px 0; }
        .post-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .post-kid { padding: 10px; border: 1px solid #ccc; background: #fafafa; }
        .post-name { font-family: 'Archivo Black', sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
        .post-chore { font-size: 12px; padding: 3px 0; color: #444; }
        .post-quote { position: absolute; bottom: 20px; left: 20px; right: 100px; font-style: italic; font-size: 12px; color: #555; border-left: 3px solid #000; padding-left: 10px; }
      `}</style>
      <div className="post">
        <div className="post-stamp">
          <div className="post-stamp-text">Chores</div>
          <div className="post-stamp-value">★</div>
          <div className="post-stamp-text">Home</div>
        </div>
        <div className="post-header">
          <div className="post-title">Daily Tasks</div>
          <div className="post-date">{date}</div>
        </div>
        <div className="post-divider" />
        <div className="post-grid">
          {kids.map((kid) => (
            <div key={kid.name} className="post-kid">
              <div className="post-name">{kid.name}</div>
              {kid.chores.map((chore, i) => (<div key={i} className="post-chore">→ {chore}</div>))}
            </div>
          ))}
        </div>
        {benQuote && (<div className="post-quote">P.S. Ben says: "{benQuote}"</div>)}
      </div>
    </ChoreDisplay>
  ),
};

// 15. CINEMA MARQUEE - Theater style
export const CinemaMarquee: Story = {
  render: ({ date, kids, benQuote }) => (
    <ChoreDisplay date={date} kids={kids} benQuote={benQuote} style={{ background: "#111" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
        .cinema { font-family: 'Anton', sans-serif; background: #111; height: 100%; padding: 16px; box-sizing: border-box; }
        .cinema-marquee { background: #1a1a1a; border: 6px solid #fff; height: 100%; box-sizing: border-box; padding: 14px 20px; position: relative; }
        .cinema-lights { position: absolute; top: -3px; left: 18px; right: 18px; height: 6px; background: repeating-linear-gradient(90deg, #fff 0px, #fff 6px, transparent 6px, transparent 20px); }
        .cinema-lights-bottom { top: auto; bottom: -3px; }
        .cinema-header { text-align: center; margin-bottom: 16px; }
        .cinema-title { font-size: 44px; color: #fff; letter-spacing: 6px; }
        .cinema-subtitle { font-size: 11px; color: #888; letter-spacing: 5px; text-transform: uppercase; font-family: sans-serif; }
        .cinema-date { font-size: 13px; color: #fff; margin-top: 6px; font-family: sans-serif; }
        .cinema-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .cinema-kid { background: rgba(255,255,255,0.05); border: 2px solid #fff; padding: 10px; }
        .cinema-name { font-size: 20px; color: #fff; letter-spacing: 2px; margin-bottom: 6px; }
        .cinema-chore { font-size: 12px; color: #ccc; padding: 3px 0; font-family: sans-serif; font-weight: 300; }
        .cinema-chore::before { content: '★ '; color: #fff; }
        .cinema-quote { position: absolute; bottom: 22px; left: 50%; transform: translateX(-50%); text-align: center; color: #888; font-size: 11px; max-width: 480px; font-family: sans-serif; }
        .cinema-quote-attr { color: #fff; margin-top: 3px; }
      `}</style>
      <div className="cinema">
        <div className="cinema-marquee">
          <div className="cinema-lights" />
          <div className="cinema-lights cinema-lights-bottom" />
          <div className="cinema-header">
            <div className="cinema-title">NOW SHOWING</div>
            <div className="cinema-subtitle">Today's Chores</div>
            <div className="cinema-date">{date}</div>
          </div>
          <div className="cinema-grid">
            {kids.map((kid) => (
              <div key={kid.name} className="cinema-kid">
                <div className="cinema-name">{kid.name}</div>
                {kid.chores.map((chore, i) => (<div key={i} className="cinema-chore">{chore}</div>))}
              </div>
            ))}
          </div>
          {benQuote && (<div className="cinema-quote">"{benQuote}"<div className="cinema-quote-attr">— SPECIAL MESSAGE FROM BEN</div></div>)}
        </div>
      </div>
    </ChoreDisplay>
  ),
};

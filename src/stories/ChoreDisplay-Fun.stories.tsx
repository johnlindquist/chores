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

// 16. WOODBLOCK - Japanese print inspired
export const Woodblock: Story = {
  render: ({ date, kids, benQuote }) => (
    <ChoreDisplay date={date} kids={kids} benQuote={benQuote}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;600&display=swap');
        .wood { font-family: 'Shippori Mincho', serif; background: #fff; height: 100%; padding: 20px; box-sizing: border-box; position: relative; }
        .wood::before { content: ''; position: absolute; top: 14px; left: 14px; right: 14px; bottom: 14px; border: 3px solid #000; pointer-events: none; }
        .wood-seal { position: absolute; top: 22px; right: 28px; width: 44px; height: 56px; background: #000; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 18px; writing-mode: vertical-rl; }
        .wood-header { margin-bottom: 20px; padding-right: 70px; }
        .wood-title { font-size: 38px; font-weight: 600; letter-spacing: 6px; }
        .wood-subtitle { font-size: 13px; color: #444; margin-top: 3px; }
        .wood-wave { height: 16px; background: repeating-linear-gradient(90deg, #000 0px, #000 2px, transparent 2px, transparent 4px, #000 4px, #000 6px, transparent 6px, transparent 18px); margin: 14px 0; opacity: 0.3; }
        .wood-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        .wood-kid { position: relative; padding: 14px; border-left: 3px solid #000; }
        .wood-name { font-size: 22px; font-weight: 600; margin-bottom: 10px; }
        .wood-chore { font-size: 13px; padding: 5px 0; border-bottom: 1px solid rgba(0,0,0,0.2); }
        .wood-chore:last-child { border-bottom: none; }
        .wood-quote { position: absolute; bottom: 28px; left: 28px; font-style: italic; font-size: 13px; color: #444; max-width: 380px; }
      `}</style>
      <div className="wood">
        <div className="wood-seal">仕事</div>
        <div className="wood-header">
          <div className="wood-title">日課</div>
          <div className="wood-subtitle">{date}</div>
        </div>
        <div className="wood-wave" />
        <div className="wood-grid">
          {kids.map((kid) => (
            <div key={kid.name} className="wood-kid">
              <div className="wood-name">{kid.name}</div>
              {kid.chores.map((chore, i) => (<div key={i} className="wood-chore">{chore}</div>))}
            </div>
          ))}
        </div>
        {benQuote && (<div className="wood-quote">「{benQuote}」— Ben</div>)}
      </div>
    </ChoreDisplay>
  ),
};

// 17. SCIENCE LAB - Periodic table inspired
export const ScienceLab: Story = {
  render: ({ date, kids, benQuote }) => (
    <ChoreDisplay date={date} kids={kids} benQuote={benQuote} style={{ background: "#111" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Orbitron:wght@400;700&display=swap');
        .sci { font-family: 'JetBrains Mono', monospace; background: #111; color: #ddd; height: 100%; padding: 18px; box-sizing: border-box; }
        .sci-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; padding-bottom: 10px; border-bottom: 2px solid #333; }
        .sci-title { font-family: 'Orbitron', sans-serif; font-size: 26px; font-weight: 700; letter-spacing: 3px; }
        .sci-date { font-size: 11px; color: #777; }
        .sci-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .sci-element { background: #1a1a1a; border: 2px solid #444; padding: 0; position: relative; }
        .sci-symbol { position: absolute; top: 6px; left: 10px; font-size: 10px; opacity: 0.5; }
        .sci-number { position: absolute; top: 6px; right: 10px; font-size: 10px; opacity: 0.5; }
        .sci-name { font-family: 'Orbitron', sans-serif; font-size: 22px; font-weight: 700; text-align: center; padding: 24px 10px 6px; text-transform: uppercase; letter-spacing: 2px; }
        .sci-tasks { padding: 6px 10px 10px; border-top: 1px solid #333; }
        .sci-chore { font-size: 10px; padding: 3px 0; color: #888; }
        .sci-chore::before { content: '→ '; opacity: 0.5; }
        .sci-quote { position: absolute; bottom: 18px; left: 18px; right: 18px; font-size: 10px; color: #666; border-top: 1px solid #333; padding-top: 8px; display: flex; gap: 6px; }
        .sci-quote-label { font-weight: 700; }
      `}</style>
      <div className="sci">
        <div className="sci-header">
          <span className="sci-title">CHORE LAB</span>
          <span className="sci-date">{date}</span>
        </div>
        <div className="sci-grid">
          {kids.map((kid, index) => (
            <div key={kid.name} className="sci-element">
              <span className="sci-symbol">{kid.name.slice(0, 2)}</span>
              <span className="sci-number">{index + 1}</span>
              <div className="sci-name">{kid.name}</div>
              <div className="sci-tasks">
                {kid.chores.map((chore, i) => (<div key={i} className="sci-chore">{chore}</div>))}
              </div>
            </div>
          ))}
        </div>
        {benQuote && (<div className="sci-quote"><span className="sci-quote-label">[BEN]:</span><span>"{benQuote}"</span></div>)}
      </div>
    </ChoreDisplay>
  ),
};

// 18. RECIPE CARD - Kitchen style
export const RecipeCard: Story = {
  render: ({ date, kids, benQuote }) => (
    <ChoreDisplay date={date} kids={kids} benQuote={benQuote}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Nunito:wght@300;600&display=swap');
        .recipe { font-family: 'Nunito', sans-serif; background: #fff; height: 100%; padding: 20px 24px; box-sizing: border-box; border: 8px solid #000; }
        .recipe-header { text-align: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px dashed #000; }
        .recipe-title { font-family: 'Amatic SC', cursive; font-size: 52px; font-weight: 700; letter-spacing: 4px; }
        .recipe-date { font-size: 12px; font-weight: 300; letter-spacing: 3px; text-transform: uppercase; }
        .recipe-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .recipe-kid { background: #f8f8f8; padding: 12px; border: 1px solid #ddd; }
        .recipe-name { font-family: 'Amatic SC', cursive; font-size: 32px; font-weight: 700; margin-bottom: 8px; border-bottom: 1px solid #000; padding-bottom: 4px; }
        .recipe-label { font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #666; margin-bottom: 4px; }
        .recipe-chore { font-size: 12px; font-weight: 300; padding: 4px 0; position: relative; padding-left: 16px; }
        .recipe-chore::before { content: '▢'; position: absolute; left: 0; font-size: 10px; }
        .recipe-quote { position: absolute; bottom: 26px; left: 50%; transform: translateX(-50%); font-family: 'Amatic SC', cursive; font-size: 24px; font-weight: 700; }
      `}</style>
      <div className="recipe">
        <div className="recipe-header">
          <div className="recipe-title">Today's Chores</div>
          <div className="recipe-date">{date}</div>
        </div>
        <div className="recipe-grid">
          {kids.map((kid) => (
            <div key={kid.name} className="recipe-kid">
              <div className="recipe-name">{kid.name}</div>
              <div className="recipe-label">Instructions:</div>
              {kid.chores.map((chore, i) => (<div key={i} className="recipe-chore">{chore}</div>))}
            </div>
          ))}
        </div>
        {benQuote && (<div className="recipe-quote">Chef Ben says: "{benQuote}"</div>)}
      </div>
    </ChoreDisplay>
  ),
};

// 19. LABEL MAKER - Embossed tape style
export const LabelMaker: Story = {
  render: ({ date, kids, benQuote }) => (
    <ChoreDisplay date={date} kids={kids} benQuote={benQuote} style={{ background: "#e8e8e8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@700&display=swap');
        .label { font-family: 'Inconsolata', monospace; background: #e8e8e8; height: 100%; padding: 24px; box-sizing: border-box; }
        .label-header { margin-bottom: 20px; }
        .label-tape { background: #000; color: #fff; display: inline-block; padding: 8px 20px; font-size: 28px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; }
        .label-date { margin-top: 8px; font-size: 11px; letter-spacing: 2px; color: #666; }
        .label-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .label-kid { background: #fff; padding: 14px; border: 2px solid #000; }
        .label-name { background: #000; color: #fff; display: inline-block; padding: 4px 12px; font-size: 14px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; }
        .label-chore { font-size: 13px; padding: 6px 0; border-bottom: 1px dotted #999; display: flex; gap: 8px; }
        .label-chore:last-child { border-bottom: none; }
        .label-check { width: 16px; height: 16px; border: 2px solid #000; flex-shrink: 0; }
        .label-quote { position: absolute; bottom: 24px; left: 24px; }
        .label-quote-tape { background: #666; color: #fff; display: inline-block; padding: 6px 14px; font-size: 11px; letter-spacing: 1px; }
      `}</style>
      <div className="label">
        <div className="label-header">
          <div className="label-tape">CHORES</div>
          <div className="label-date">{date}</div>
        </div>
        <div className="label-grid">
          {kids.map((kid) => (
            <div key={kid.name} className="label-kid">
              <div className="label-name">{kid.name}</div>
              {kid.chores.map((chore, i) => (
                <div key={i} className="label-chore">
                  <div className="label-check" />
                  <span>{chore}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        {benQuote && (<div className="label-quote"><div className="label-quote-tape">BEN: {benQuote}</div></div>)}
      </div>
    </ChoreDisplay>
  ),
};

// 20. TRAIN STATION - Departure board style
export const TrainStation: Story = {
  render: ({ date, kids, benQuote }) => (
    <ChoreDisplay date={date} kids={kids} benQuote={benQuote} style={{ background: "#1a1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        .train { font-family: 'Share Tech Mono', monospace; background: #1a1a1a; color: #fff; height: 100%; padding: 18px; box-sizing: border-box; }
        .train-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 3px solid #fff; }
        .train-title { font-size: 28px; letter-spacing: 6px; text-transform: uppercase; }
        .train-date { font-size: 14px; opacity: 0.7; }
        .train-board { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3px; }
        .train-row { background: #222; padding: 10px 12px; }
        .train-name { font-size: 18px; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #444; display: flex; justify-content: space-between; align-items: center; }
        .train-count { background: #fff; color: #000; padding: 2px 8px; font-size: 14px; }
        .train-chore { font-size: 12px; padding: 4px 0; opacity: 0.8; }
        .train-chore::before { content: '▸ '; }
        .train-status { display: inline-block; background: #fff; color: #000; padding: 1px 6px; font-size: 9px; margin-left: 6px; }
        .train-ticker { position: absolute; bottom: 18px; left: 18px; right: 18px; background: #fff; color: #000; padding: 8px 14px; font-size: 12px; overflow: hidden; white-space: nowrap; }
      `}</style>
      <div className="train">
        <div className="train-header">
          <span className="train-title">DEPARTURES</span>
          <span className="train-date">{date}</span>
        </div>
        <div className="train-board">
          {kids.map((kid) => (
            <div key={kid.name} className="train-row">
              <div className="train-name">
                {kid.name.toUpperCase()}
                <span className="train-count">{kid.chores.length}</span>
              </div>
              {kid.chores.map((chore, i) => (
                <div key={i} className="train-chore">
                  {chore}
                  <span className="train-status">TODO</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        {benQuote && (<div className="train-ticker">ANNOUNCEMENT: {benQuote.toUpperCase()} — BEN</div>)}
      </div>
    </ChoreDisplay>
  ),
};

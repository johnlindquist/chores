import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  ChoreDisplay,
  sampleKids,
  sampleDate,
  sampleQuote,
} from "../components/ChoreDisplay";

const meta: Meta<typeof ChoreDisplay> = {
  title: "TRMNL/ChoreDisplay",
  component: ChoreDisplay,
  parameters: {
    layout: "centered",
    backgrounds: { default: "gray", values: [{ name: "gray", value: "#888" }] },
  },
  args: { date: sampleDate, kids: sampleKids, benQuote: sampleQuote },
};
export default meta;
type Story = StoryObj<typeof ChoreDisplay>;

// 6. TERMINAL - Retro computer
export const Terminal: Story = {
  render: ({ date, kids, benQuote }) => (
    <ChoreDisplay
      date={date}
      kids={kids}
      benQuote={benQuote}
      style={{ background: "#000" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        .term { font-family: 'VT323', monospace; background: #000; color: #fff; height: 100%; padding: 16px; box-sizing: border-box; }
        .term-header { border-bottom: 2px solid #fff; padding-bottom: 10px; margin-bottom: 14px; }
        .term-prompt { font-size: 16px; opacity: 0.7; }
        .term-title { font-size: 32px; letter-spacing: 3px; }
        .term-date { font-size: 18px; opacity: 0.7; }
        .term-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .term-kid { border: 1px solid #fff; padding: 10px; }
        .term-name { font-size: 24px; margin-bottom: 8px; }
        .term-name::before { content: '> '; opacity: 0.5; }
        .term-chore { font-size: 18px; padding: 3px 0; padding-left: 16px; }
        .term-chore::before { content: '- '; }
        .term-quote { position: absolute; bottom: 16px; left: 16px; right: 16px; font-size: 16px; border-top: 1px solid #fff; padding-top: 8px; }
        .term-blink { animation: blink 1s infinite; }
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
      `}</style>
      <div className="term">
        <div className="term-header">
          <div className="term-prompt">chores@home:~$</div>
          <div className="term-title">DAILY_CHORES.exe</div>
          <div className="term-date">[{date}]</div>
        </div>
        <div className="term-grid">
          {kids.map((kid) => (
            <div key={kid.name} className="term-kid">
              <div className="term-name">{kid.name.toUpperCase()}</div>
              {kid.chores.map((chore, i) => (
                <div key={i} className="term-chore">
                  {chore}
                </div>
              ))}
            </div>
          ))}
        </div>
        {benQuote && (
          <div className="term-quote">
            <span className="term-blink">█</span> BEN.says("{benQuote}")
          </div>
        )}
      </div>
    </ChoreDisplay>
  ),
};

// 7. BLUEPRINT - Technical drawing
export const Blueprint: Story = {
  render: ({ date, kids, benQuote }) => (
    <ChoreDisplay
      date={date}
      kids={kids}
      benQuote={benQuote}
      style={{ background: "#fff" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');
        .bp { font-family: 'Courier Prime', monospace; background: #fff; height: 100%; padding: 16px; box-sizing: border-box; position: relative; }
        .bp::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: linear-gradient(#ddd 1px, transparent 1px), linear-gradient(90deg, #ddd 1px, transparent 1px); background-size: 20px 20px; pointer-events: none; }
        .bp-border { border: 2px solid #000; height: 100%; box-sizing: border-box; padding: 14px; position: relative; background: #fff; }
        .bp-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #000; padding-bottom: 10px; margin-bottom: 14px; }
        .bp-title { font-size: 22px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; }
        .bp-meta { font-size: 10px; text-align: right; }
        .bp-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .bp-kid { border: 1px dashed #000; padding: 10px; position: relative; }
        .bp-kid::before { content: '+'; position: absolute; top: -5px; left: -5px; font-size: 10px; }
        .bp-kid::after { content: '+'; position: absolute; bottom: -5px; right: -5px; font-size: 10px; }
        .bp-name { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; padding-bottom: 5px; border-bottom: 1px solid #888; }
        .bp-chore { font-size: 11px; padding: 3px 0; }
        .bp-chore::before { content: '→ '; opacity: 0.6; }
        .bp-quote { position: absolute; bottom: 20px; right: 20px; font-size: 10px; max-width: 280px; text-align: right; border: 1px solid #000; padding: 4px 8px; }
      `}</style>
      <div className="bp">
        <div className="bp-border">
          <div className="bp-header">
            <span className="bp-title">Chore Specifications</span>
            <div className="bp-meta">
              <div>DWG: CHORES-001</div>
              <div>{date}</div>
            </div>
          </div>
          <div className="bp-grid">
            {kids.map((kid) => (
              <div key={kid.name} className="bp-kid">
                <div className="bp-name">{kid.name}</div>
                {kid.chores.map((chore, i) => (
                  <div key={i} className="bp-chore">
                    {chore}
                  </div>
                ))}
              </div>
            ))}
          </div>
          {benQuote && <div className="bp-quote">NOTE: {benQuote} — BEN</div>}
        </div>
      </div>
    </ChoreDisplay>
  ),
};

// 8. MINIMAL ZEN - Japanese inspired
export const MinimalZen: Story = {
  render: ({ date, kids, benQuote }) => (
    <ChoreDisplay date={date} kids={kids} benQuote={benQuote}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;600&display=swap');
        .zen { font-family: 'Noto Serif JP', serif; background: #fff; height: 100%; padding: 36px 50px; box-sizing: border-box; display: flex; flex-direction: column; }
        .zen-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; padding-bottom: 14px; border-bottom: 1px solid #000; }
        .zen-title { font-size: 32px; font-weight: 400; letter-spacing: 10px; }
        .zen-date { font-size: 11px; font-weight: 300; letter-spacing: 3px; text-transform: uppercase; }
        .zen-content { flex: 1; display: grid; grid-template-columns: repeat(4, 1fr); gap: 36px; }
        .zen-kid { display: flex; flex-direction: column; }
        .zen-name { font-size: 18px; font-weight: 600; margin-bottom: 14px; position: relative; }
        .zen-name::after { content: ''; position: absolute; bottom: -6px; left: 0; width: 20px; height: 2px; background: #000; }
        .zen-chore { font-size: 13px; font-weight: 300; padding: 6px 0; letter-spacing: 1px; }
        .zen-quote { margin-top: auto; padding-top: 20px; font-size: 12px; font-weight: 300; letter-spacing: 2px; text-align: right; opacity: 0.7; }
      `}</style>
      <div className="zen">
        <div className="zen-header">
          <div className="zen-title">仕事</div>
          <div className="zen-date">{date}</div>
        </div>
        <div className="zen-content">
          {kids.map((kid) => (
            <div key={kid.name} className="zen-kid">
              <div className="zen-name">{kid.name}</div>
              {kid.chores.map((chore, i) => (
                <div key={i} className="zen-chore">
                  {chore}
                </div>
              ))}
            </div>
          ))}
        </div>
        {benQuote && <div className="zen-quote">— {benQuote}</div>}
      </div>
    </ChoreDisplay>
  ),
};

// 9. MAGAZINE - Editorial layout
export const Magazine: Story = {
  render: ({ date, kids, benQuote }) => (
    <ChoreDisplay date={date} kids={kids} benQuote={benQuote}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Oswald:wght@300;700&display=swap');
        .mag { font-family: 'Libre Baskerville', serif; background: #fff; height: 100%; padding: 0; box-sizing: border-box; display: grid; grid-template-columns: 240px 1fr; }
        .mag-hero { background: #000; color: #fff; padding: 28px; display: flex; flex-direction: column; justify-content: space-between; }
        .mag-title { font-family: 'Oswald', sans-serif; font-size: 64px; font-weight: 700; line-height: 0.9; letter-spacing: -2px; }
        .mag-sub { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; opacity: 0.7; }
        .mag-date { font-family: 'Oswald', sans-serif; font-size: 13px; font-weight: 300; letter-spacing: 2px; }
        .mag-content { padding: 20px 28px; display: flex; flex-direction: column; }
        .mag-grid { flex: 1; display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .mag-kid { padding: 14px 0; border-bottom: 1px solid #ddd; }
        .mag-name { font-family: 'Oswald', sans-serif; font-size: 24px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; }
        .mag-chore { font-size: 13px; line-height: 1.6; }
        .mag-quote { margin-top: auto; padding-top: 14px; border-top: 2px solid #000; font-style: italic; font-size: 14px; }
        .mag-quote-attr { font-family: 'Oswald', sans-serif; font-style: normal; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin-top: 6px; display: block; }
      `}</style>
      <div className="mag">
        <div className="mag-hero">
          <div>
            <div className="mag-title">CHORES</div>
            <div className="mag-sub">Daily Edition</div>
          </div>
          <div className="mag-date">{date}</div>
        </div>
        <div className="mag-content">
          <div className="mag-grid">
            {kids.map((kid) => (
              <div key={kid.name} className="mag-kid">
                <div className="mag-name">{kid.name}</div>
                {kid.chores.map((chore, i) => (
                  <div key={i} className="mag-chore">
                    • {chore}
                  </div>
                ))}
              </div>
            ))}
          </div>
          {benQuote && (
            <div className="mag-quote">
              "{benQuote}"<span className="mag-quote-attr">— Ben</span>
            </div>
          )}
        </div>
      </div>
    </ChoreDisplay>
  ),
};

// 10. SCOREBOARD - Sports style
export const Scoreboard: Story = {
  render: ({ date, kids, benQuote }) => (
    <ChoreDisplay
      date={date}
      kids={kids}
      benQuote={benQuote}
      style={{ background: "#000" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Black+Ops+One&family=Russo+One&display=swap');
        .score { font-family: 'Russo One', sans-serif; background: #000; height: 100%; padding: 14px; box-sizing: border-box; }
        .score-frame { background: #111; border: 3px solid #444; height: 100%; box-sizing: border-box; padding: 14px; }
        .score-header { text-align: center; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 3px solid #fff; }
        .score-title { font-family: 'Black Ops One', cursive; font-size: 32px; color: #fff; letter-spacing: 3px; }
        .score-date { font-size: 13px; color: #888; margin-top: 3px; }
        .score-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .score-player { background: #222; border: 2px solid #444; overflow: hidden; }
        .score-nameplate { background: #333; padding: 6px 10px; text-align: center; }
        .score-name { font-size: 16px; color: #fff; text-transform: uppercase; letter-spacing: 2px; }
        .score-count { background: #000; color: #fff; font-size: 26px; text-align: center; padding: 3px; font-family: 'Black Ops One', cursive; }
        .score-tasks { padding: 8px; }
        .score-chore { font-size: 11px; color: #aaa; padding: 3px 0; border-bottom: 1px solid #333; }
        .score-chore:last-child { border-bottom: none; }
        .score-chore::before { content: '▶ '; color: #fff; }
        .score-ticker { position: absolute; bottom: 14px; left: 14px; right: 14px; background: #fff; color: #000; padding: 6px 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
      `}</style>
      <div className="score">
        <div className="score-frame">
          <div className="score-header">
            <div className="score-title">CHORE ZONE</div>
            <div className="score-date">{date}</div>
          </div>
          <div className="score-grid">
            {kids.map((kid) => (
              <div key={kid.name} className="score-player">
                <div className="score-nameplate">
                  <div className="score-name">{kid.name}</div>
                </div>
                <div className="score-count">{kid.chores.length}</div>
                <div className="score-tasks">
                  {kid.chores.map((chore, i) => (
                    <div key={i} className="score-chore">
                      {chore}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {benQuote && (
            <div className="score-ticker">BREAKING: BEN SAYS "{benQuote}"</div>
          )}
        </div>
      </div>
    </ChoreDisplay>
  ),
};

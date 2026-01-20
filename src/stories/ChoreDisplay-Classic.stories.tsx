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

// 1. BRUTALIST - Heavy borders, industrial
export const Brutalist: Story = {
  render: ({ date, kids, benQuote }) => (
    <ChoreDisplay date={date} kids={kids} benQuote={benQuote}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        .brutalist { font-family: 'Space Mono', monospace; background: #fff; padding: 0; height: 100%; box-sizing: border-box; }
        .brutalist-header { background: #000; color: #fff; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; }
        .brutalist-title { font-size: 28px; font-weight: 700; text-transform: uppercase; letter-spacing: 6px; }
        .brutalist-date { font-size: 13px; border: 2px solid #fff; padding: 5px 10px; }
        .brutalist-grid { display: grid; grid-template-columns: repeat(4, 1fr); height: calc(100% - 70px); }
        .brutalist-kid { border-right: 4px solid #000; border-bottom: 4px solid #000; padding: 14px; }
        .brutalist-kid:last-child { border-right: none; }
        .brutalist-name { font-size: 18px; font-weight: 700; text-transform: uppercase; border-bottom: 3px solid #000; padding-bottom: 6px; margin-bottom: 10px; }
        .brutalist-chore { font-size: 12px; padding: 5px 0; border-bottom: 1px solid #000; }
        .brutalist-quote { position: absolute; bottom: 0; left: 0; right: 0; background: #000; color: #fff; padding: 8px 20px; font-size: 11px; display: flex; gap: 8px; }
        .brutalist-quote-label { font-weight: 700; }
      `}</style>
      <div className="brutalist">
        <div className="brutalist-header">
          <span className="brutalist-title">Chores</span>
          <span className="brutalist-date">{date}</span>
        </div>
        <div className="brutalist-grid">
          {kids.map((kid) => (
            <div key={kid.name} className="brutalist-kid">
              <div className="brutalist-name">{kid.name}</div>
              {kid.chores.map((chore, i) => (<div key={i} className="brutalist-chore">{chore}</div>))}
            </div>
          ))}
        </div>
        {benQuote && (<div className="brutalist-quote"><span className="brutalist-quote-label">BEN:</span><span>"{benQuote}"</span></div>)}
      </div>
    </ChoreDisplay>
  ),
};

// 2. NEWSPAPER - Classic broadsheet
export const Newspaper: Story = {
  render: ({ date, kids, benQuote }) => (
    <ChoreDisplay date={date} kids={kids} benQuote={benQuote}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Serif+4:wght@400;600&display=swap');
        .newspaper { font-family: 'Source Serif 4', serif; background: #fff; height: 100%; padding: 14px 20px; box-sizing: border-box; }
        .newspaper-masthead { text-align: center; border-bottom: 4px double #000; padding-bottom: 6px; margin-bottom: 10px; }
        .newspaper-title { font-family: 'Playfair Display', serif; font-size: 44px; font-weight: 900; letter-spacing: -1px; line-height: 1; }
        .newspaper-subtitle { font-size: 10px; text-transform: uppercase; letter-spacing: 6px; margin-top: 2px; }
        .newspaper-dateline { display: flex; justify-content: space-between; font-size: 9px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #000; padding: 5px 0; margin-bottom: 12px; }
        .newspaper-columns { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .newspaper-column { border-right: 1px solid #888; padding-right: 14px; }
        .newspaper-column:last-child { border-right: none; }
        .newspaper-name { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; border-bottom: 2px solid #000; margin-bottom: 8px; padding-bottom: 3px; }
        .newspaper-chore { font-size: 13px; line-height: 1.4; text-indent: 1em; margin-bottom: 3px; }
        .newspaper-quote { position: absolute; bottom: 14px; left: 20px; right: 20px; font-style: italic; font-size: 12px; border-top: 1px solid #000; padding-top: 6px; text-align: center; }
      `}</style>
      <div className="newspaper">
        <div className="newspaper-masthead">
          <div className="newspaper-title">The Daily Chores</div>
          <div className="newspaper-subtitle">All the Tasks Fit to Complete</div>
        </div>
        <div className="newspaper-dateline">
          <span>Vol. MMXXVI No. 7</span><span>{date}</span><span>Price: One Clean Room</span>
        </div>
        <div className="newspaper-columns">
          {kids.map((kid) => (
            <div key={kid.name} className="newspaper-column">
              <div className="newspaper-name">{kid.name}</div>
              {kid.chores.map((chore, i) => (<div key={i} className="newspaper-chore">• {chore}</div>))}
            </div>
          ))}
        </div>
        {benQuote && (<div className="newspaper-quote"><strong>BEN'S CORNER:</strong> "{benQuote}"</div>)}
      </div>
    </ChoreDisplay>
  ),
};

// 3. TYPEWRITER - Vintage mechanical
export const Typewriter: Story = {
  render: ({ date, kids, benQuote }) => (
    <ChoreDisplay date={date} kids={kids} benQuote={benQuote}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
        .typewriter { font-family: 'Special Elite', monospace; background: #fff; height: 100%; padding: 28px 40px; box-sizing: border-box; }
        .typewriter-header { text-align: center; margin-bottom: 20px; }
        .typewriter-title { font-size: 32px; letter-spacing: 6px; text-transform: uppercase; }
        .typewriter-date { font-size: 13px; margin-top: 6px; letter-spacing: 3px; }
        .typewriter-rule { border: none; border-top: 2px solid #000; margin: 14px 0; }
        .typewriter-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px 40px; }
        .typewriter-kid { padding: 10px 0; }
        .typewriter-name { font-size: 20px; text-transform: uppercase; letter-spacing: 3px; text-decoration: underline; margin-bottom: 10px; }
        .typewriter-chore { font-size: 15px; padding: 3px 0; line-height: 1.7; }
        .typewriter-chore::before { content: '[ ] '; }
        .typewriter-quote { position: absolute; bottom: 28px; left: 40px; right: 40px; font-size: 13px; font-style: italic; border-top: 1px solid #000; padding-top: 10px; }
      `}</style>
      <div className="typewriter">
        <div className="typewriter-header">
          <div className="typewriter-title">Daily Chores</div>
          <div className="typewriter-date">{date}</div>
        </div>
        <hr className="typewriter-rule" />
        <div className="typewriter-grid">
          {kids.map((kid) => (
            <div key={kid.name} className="typewriter-kid">
              <div className="typewriter-name">{kid.name}</div>
              {kid.chores.map((chore, i) => (<div key={i} className="typewriter-chore">{chore}</div>))}
            </div>
          ))}
        </div>
        {benQuote && (<div className="typewriter-quote">Note from Ben: "{benQuote}"</div>)}
      </div>
    </ChoreDisplay>
  ),
};

// 4. SWISS GRID - International Typographic Style
export const SwissGrid: Story = {
  render: ({ date, kids, benQuote }) => (
    <ChoreDisplay date={date} kids={kids} benQuote={benQuote}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        .swiss { font-family: Helvetica, Arial, sans-serif; background: #fff; height: 100%; padding: 0; box-sizing: border-box; display: grid; grid-template-columns: 100px 1fr; }
        .swiss-sidebar { background: #000; color: #fff; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; }
        .swiss-title { font-family: 'Bebas Neue', sans-serif; font-size: 60px; line-height: 0.85; letter-spacing: -1px; writing-mode: vertical-rl; transform: rotate(180deg); }
        .swiss-date { font-size: 10px; font-weight: 300; letter-spacing: 2px; writing-mode: vertical-rl; transform: rotate(180deg); }
        .swiss-content { padding: 20px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .swiss-kid { border-left: 2px solid #000; padding-left: 10px; }
        .swiss-name { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px; }
        .swiss-chore { font-size: 12px; font-weight: 300; padding: 3px 0; line-height: 1.5; }
        .swiss-quote { position: absolute; bottom: 0; right: 0; left: 100px; padding: 10px 20px; font-size: 11px; font-weight: 300; border-top: 1px solid #888; }
      `}</style>
      <div className="swiss">
        <div className="swiss-sidebar">
          <div className="swiss-title">CHORES</div>
          <div className="swiss-date">{date}</div>
        </div>
        <div className="swiss-content">
          {kids.map((kid) => (
            <div key={kid.name} className="swiss-kid">
              <div className="swiss-name">{kid.name}</div>
              {kid.chores.map((chore, i) => (<div key={i} className="swiss-chore">{chore}</div>))}
            </div>
          ))}
        </div>
        {benQuote && (<div className="swiss-quote">BEN — "{benQuote}"</div>)}
      </div>
    </ChoreDisplay>
  ),
};

// 5. CHALKBOARD - School slate
export const Chalkboard: Story = {
  render: ({ date, kids, benQuote }) => (
    <ChoreDisplay date={date} kids={kids} benQuote={benQuote} style={{ background: "#2a2a2a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Patrick+Hand&display=swap');
        .chalk { font-family: 'Patrick Hand', cursive; background: #2a2a2a; color: #f0f0e8; height: 100%; padding: 20px; box-sizing: border-box; }
        .chalk-frame { border: 10px solid #5c3d2e; height: 100%; box-sizing: border-box; padding: 14px; }
        .chalk-header { text-align: center; margin-bottom: 16px; }
        .chalk-title { font-family: 'Caveat', cursive; font-size: 48px; font-weight: 700; text-decoration: underline; text-decoration-style: wavy; }
        .chalk-date { font-size: 18px; opacity: 0.8; }
        .chalk-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .chalk-kid { padding: 10px; }
        .chalk-name { font-family: 'Caveat', cursive; font-size: 30px; font-weight: 700; border-bottom: 2px dashed rgba(255,255,255,0.4); margin-bottom: 6px; }
        .chalk-chore { font-size: 18px; padding: 3px 0; padding-left: 18px; position: relative; }
        .chalk-chore::before { content: '☐'; position: absolute; left: 0; }
        .chalk-quote { position: absolute; bottom: 32px; right: 36px; font-family: 'Caveat', cursive; font-size: 20px; transform: rotate(-2deg); }
      `}</style>
      <div className="chalk">
        <div className="chalk-frame">
          <div className="chalk-header">
            <div className="chalk-title">Today's Chores</div>
            <div className="chalk-date">{date}</div>
          </div>
          <div className="chalk-grid">
            {kids.map((kid) => (
              <div key={kid.name} className="chalk-kid">
                <div className="chalk-name">{kid.name} ★</div>
                {kid.chores.map((chore, i) => (<div key={i} className="chalk-chore">{chore}</div>))}
              </div>
            ))}
          </div>
          {benQuote && (<div className="chalk-quote">~ Ben says: "{benQuote}" ~</div>)}
        </div>
      </div>
    </ChoreDisplay>
  ),
};

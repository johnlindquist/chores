import { sql } from "@vercel/postgres";

// Types for our database models
export interface InstallSession {
  access_token: string;
  created_at: Date;
}

export interface PluginInstance {
  uuid: string;
  plugin_setting_id: number | null;
  access_token: string;
  user_email: string | null;
  user_name: string | null;
  time_zone_iana: string | null;
  schedule_text: string;
  created_at: Date;
  updated_at: Date;
}

// Install Sessions
export async function createInstallSession(
  accessToken: string
): Promise<void> {
  await sql`
    INSERT INTO install_sessions (access_token)
    VALUES (${accessToken})
    ON CONFLICT (access_token) DO UPDATE SET created_at = NOW()
  `;
}

export async function getInstallSession(
  accessToken: string
): Promise<InstallSession | null> {
  const result = await sql<InstallSession>`
    SELECT * FROM install_sessions WHERE access_token = ${accessToken}
  `;
  return result.rows[0] || null;
}

export async function deleteInstallSession(accessToken: string): Promise<void> {
  await sql`DELETE FROM install_sessions WHERE access_token = ${accessToken}`;
}

// Plugin Instances
export async function createPluginInstance(data: {
  uuid: string;
  plugin_setting_id?: number;
  access_token: string;
  user_email?: string;
  user_name?: string;
  time_zone_iana?: string;
  schedule_text?: string;
}): Promise<void> {
  const scheduleText = data.schedule_text || getDefaultSchedule();

  await sql`
    INSERT INTO plugin_instances (
      uuid, plugin_setting_id, access_token, user_email, user_name, time_zone_iana, schedule_text
    ) VALUES (
      ${data.uuid},
      ${data.plugin_setting_id || null},
      ${data.access_token},
      ${data.user_email || null},
      ${data.user_name || null},
      ${data.time_zone_iana || null},
      ${scheduleText}
    )
    ON CONFLICT (uuid) DO UPDATE SET
      plugin_setting_id = EXCLUDED.plugin_setting_id,
      access_token = EXCLUDED.access_token,
      user_email = EXCLUDED.user_email,
      user_name = EXCLUDED.user_name,
      time_zone_iana = EXCLUDED.time_zone_iana,
      updated_at = NOW()
  `;
}

export async function getPluginInstance(
  uuid: string
): Promise<PluginInstance | null> {
  const result = await sql<PluginInstance>`
    SELECT * FROM plugin_instances WHERE uuid = ${uuid}
  `;
  return result.rows[0] || null;
}

export async function getPluginInstanceByToken(
  accessToken: string
): Promise<PluginInstance | null> {
  const result = await sql<PluginInstance>`
    SELECT * FROM plugin_instances WHERE access_token = ${accessToken}
  `;
  return result.rows[0] || null;
}

export async function updateScheduleText(
  uuid: string,
  scheduleText: string
): Promise<void> {
  await sql`
    UPDATE plugin_instances
    SET schedule_text = ${scheduleText}, updated_at = NOW()
    WHERE uuid = ${uuid}
  `;
}

export async function deletePluginInstance(uuid: string): Promise<void> {
  await sql`DELETE FROM plugin_instances WHERE uuid = ${uuid}`;
}

// Ben's Current Quote
export async function getCurrentBenQuote(): Promise<string | null> {
  const result = await sql<{ quote: string }>`
    SELECT quote FROM current_ben_quote WHERE id = 1
  `;
  return result.rows[0]?.quote || null;
}

export async function setCurrentBenQuote(quote: string): Promise<void> {
  await sql`
    INSERT INTO current_ben_quote (id, quote, updated_at)
    VALUES (1, ${quote}, NOW())
    ON CONFLICT (id) DO UPDATE SET quote = ${quote}, updated_at = NOW()
  `;
}

// Default schedule template
function getDefaultSchedule(): string {
  return `@kids Ava, Ben, Chloe, Dylan

# Weekly defaults
@mon
Ava: Make bed; Feed dog
Ben: Take out trash; Wipe table
Chloe: Empty dishwasher; Laundry
Dylan: Pick up toys; Sweep entry

@tue
Ava: Make bed; Set table
Ben: Bring in trash cans
Chloe: Clean bathroom sink
Dylan: Vacuum living room

@wed
Ava: Make bed; Water plants
Ben: Take out trash; Feed fish
Chloe: Fold laundry
Dylan: Pick up toys

@thu
Ava: Make bed; Set table
Ben: Wipe table; Feed dog
Chloe: Empty dishwasher
Dylan: Sweep entry

@fri
Ava: Make bed; Water plants
Ben: Take out trash
Chloe: Clean bathroom sink
Dylan: Vacuum living room

@sat
*: Big room clean

@sun
*: Rest day - no chores!

# Date overrides (wins over day-of-week)
# @2026-01-10
# Ava: Special chore
# Ben: Special chore
`;
}

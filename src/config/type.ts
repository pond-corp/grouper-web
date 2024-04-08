import typia, { tags } from "typia";

// export type color = string & tags.Pattern<"/\b(hex(#?([0-9a-fA-F]{6})))|hct((d+(?:.d+)?),s*(d+(?:.d+)?),s*(d+(?:.d+)?)))\b/">;

type twenty_char_string = string & tags.MaxLength<20>

export interface config_template {
  name: twenty_char_string;
  id: bigint;

  event: {
    auto_delete_events_after?: string;
    minimum_high_rank: number;
    minimum_rank: number;
    check_if_events_are_full?: boolean;
    types: twenty_char_string[];
  };
  places: {
    [place_name: twenty_char_string]: {
      use_direct_join_urls?: boolean;
      universe_id: string;
      place_id: bigint;
      is_main?: boolean;
    };
  };
  forms: {
    auto_delete_unreviewed_after?: string;
    minimum_create_and_destroy_rank: number;
    auto_delete_reviewed_after?: string;
    minimum_review_rank: number;
  };
  socials?: {
    guilded?: string & tags.Format<"url">;
    discord?: string & tags.Format<"url">;
  };
  theme: string | {
        primary: string;
        secondary: string;
        tertiary: string;
        error: string;
        neutral: string;
        neutral_variant: string;
      };
}

export const validate = typia.createValidateEquals<config_template>()

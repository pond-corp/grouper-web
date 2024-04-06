import { tags } from "typia";

export type color = string &
  tags.Pattern<"/\b(hex(#?([0-9a-fA-F]{6})))|hct((d+(?:.d+)?),s*(d+(?:.d+)?),s*(d+(?:.d+)?)))\b/">;

type opt<T> = T | undefined;

export interface config_template {
  name: string;
  id: bigint;

  event: {
    auto_delete_events_after: string & tags.Format<"duration">;
    minimum_high_rank: number & tags.Type<"uint32">;
    minimum_rank: number & tags.Type<"uint32">;
    check_if_events_are_full: boolean;
    types: string[];
  };
  places: {
    [place_name: string]: {
      use_direct_join_urls: boolean;
      universe_id: string;
      place_id: bigint;
      is_main?: boolean,
    };
  };
  forms: {
    maximum_paragraph_responce_length: number & tags.Type<"uint32">;
    auto_delete_unreviewed_after: string & tags.Format<"duration">;
    minimum_create_and_destroy_rank: number & tags.Type<"uint32">;
    auto_delete_reviewed_after: string & tags.Format<"duration">;
    minimum_review_rank: number & tags.Type<"uint32">;
  };
  socials?: {
    guilded?: string & tags.Format<"url">;
    discord?: string & tags.Format<"url">;
  };
  theme: color | {
        primary: color;
        secondary: color;
        tertiary: color;
        error: color;
        neutral: color;
        neutral_variant: color;
  };
}

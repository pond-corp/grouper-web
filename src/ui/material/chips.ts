
// chips.ts
// react wrappers for material-web chip web components
// @kalrnlo
// 05/04/2024

import { MdSuggestionChip } from "@material/web/chips/suggestion-chip"
import { MdAssistChip } from "@material/web/chips/assist-chip"
import { MdFilterChip } from "@material/web/chips/filter-chip"
import { MdInputChip } from "@material/web/chips/input-chip"
import { MdChipSet } from "@material/web/chips/chip-set"
import { createComponent } from "@lit/react";
import React from "react"

const class chips {
	static suggest = createComponent({
		react: React,
		elementClass: MdSuggestionChip,
		tagName: "suggest-chip",
	})
	static assist = createComponent({
		react: React,
		elementClass: MdAssistChip,
		tagName: "assist-chip",
	})
	static filter = createComponent({
		react: React,
		elementClass: MdFilterChip,
		tagName: "filter-chip",
	})
	static input = createComponent({
		react: React,
		elementClass: MdInputChip,
		tagName: "input-chip",
	})
}

export defualt Object.freeze(chips)
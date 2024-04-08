import gen from "./src/config/gen"

export default gen({
	name: "grouper-web",
	id: 0n,

	event: {
		check_if_events_are_full: true,
		auto_delete_events_after: "30 days",
		types: ["Shift", "Training"],
		minimum_high_rank: 255,
		minimum_rank: 255,
	},
	places: {
		training_center: {
			use_direct_join_urls: true,
			universe_id: "",
			place_id: 0n,
			is_main: true,
		},
		store: {
			use_direct_join_urls: true,
			universe_id: "",
			place_id: 0n,
			is_main: true,
		},
	},
	forms: {
		auto_delete_unreviewed_after: "30 days",
		minimum_create_and_destroy_rank: 20,
		auto_delete_reviewed_after: "20 days",
		minimum_review_rank: 30,
	},
	theme: "hex(#FFFFFF)",
	socials: {
		discord: "",
	},
})

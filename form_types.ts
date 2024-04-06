import typia, {tags} from "typia"

export enum question {
    multiple_choice,
    checkboxes,
    paragraph,
    sentance,
    essay,
    scale,
}

const x = submission_policy.unlimited

type question<T extends number & tags.Type<"uint32">, U> = {
    answers: Map<U, boolean>,
    description: string?,
    name: string,
    type: T,
}

export type scale_question = question<question.scale, number & tags.Type<"uint32">> & {
    high_end_text: string?,
    low_end_text: string?,
}

export type multiple_choice_question = question<question.multiple_choice, number & tags.Type<"uint32">> & {
    answer_names: Array<string>
}

export type checkboxes_question = question<question.checkboxes, number & tags.Type<"uint32">> & {
    need_all_valid_boxes_to_be_checked: boolean,
    answer_names: Array<string>
}

export type text_question<T extends question.essay | question.paragraph | question.sentance> = {
    placeholder: string?,
    description: string?,
    name: string,
    type: T,
}

export interface form {
    questions: (multiple_choice_question | text_question<number & tags.Type<"uint32">> | checkboxes_question | scale_question)[],
    delete_after_x_days: number & tags.Type<"uint32">,
    min_score_to_pass: number & tags.Type<"uint32">,
    name: string & typia.tags.ExclusiveMaximum<20>,
    can_only_have_one_application_pending: boolean,
    cooldown_days: number & tags.Type<"uint32">,
    minimum_rank: number & tags.Type<"uint32">,
    maximum_rank: number & tags.Type<"uint32">,
    can_only_apply_once: boolean,
    can_apply_in_game: boolean,
    requires_discord: boolean,
    auto_grade: boolean,
}
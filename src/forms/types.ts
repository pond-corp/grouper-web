import typia, { tags } from "typia"

export enum question {
    multiple_choice,
    checkboxes,
    paragraph,
    sentance,
    essay,
    scale,
}

export namespace form_info {
    export type base_question<T extends number & tags.Type<"uint32">> = {
        description?: string & tags.MaxLength<940>,
        name: string & tags.MaxLength<20>,
        answers: Map<number & tags.Type<"uint32">, boolean>,
        type: T,
    }
    
    export type scale_question = {
        high_end_text?: string & tags.MaxLength<20>,
        low_end_text?: string & tags.MaxLength<20>,
        description?: string & tags.MaxLength<940>,
        name: string & tags.MaxLength<20>,
        type: question.scale,
    }
    
    export type multiple_choice_question = base_question<question.multiple_choice> & {
        answer_names: Array<string & tags.MaxLength<20>>
    }
    
    export type checkboxes_question = base_question<question.checkboxes> & {
        answer_names: Array<string & tags.MaxLength<20>>,
        need_all_valid_boxes_to_be_checked: boolean,
    }
    
    // assuming average word length is 4.7 characters
    export type essay_question = {
        placeholder?: string & tags.MaxLength<3055>,
        description?: string & tags.MaxLength<940>,
        name: string & tags.MaxLength<20>,
        type: question.essay,
    }
    
    export type paragraph_question = {
        placeholder?: string & tags.MaxLength<940>,
        description?: string & tags.MaxLength<940>,
        name: string & tags.MaxLength<20>,
        type: question.paragraph,
    }
    
    export type sentance_question = {
        placeholder?: string & tags.MaxLength<94>,
        description?: string & tags.MaxLength<940>,
        name: string & tags.MaxLength<20>,
        type: question.sentance,
    }
    
    export type merged_question = {
        answers?: Map<number & tags.Type<"uint32">, boolean>,
        answer_names?: (string & tags.MaxLength<20>)[],
        need_all_valid_boxes_to_be_checked?: boolean,
        placeholder?: string & tags.MaxLength<3055>,
        high_end_text?: string & tags.MaxLength<20>,
        description?: string & tags.MaxLength<940>,
        low_end_text?: string & tags.MaxLength<20>,
        name: string & tags.MaxLength<20>,
        type: number & tags.Type<"uint32">,
    }
    
    export interface form {
        delete_after_x_days: number & tags.Type<"uint32">,
        min_score_to_pass: number & tags.Type<"uint32">,
        can_only_have_one_application_pending: boolean,
        cooldown_days: number & tags.Type<"uint32">,
        minimum_rank: number & tags.Type<"uint32">,
        maximum_rank: number & tags.Type<"uint32">,
        description?: string & tags.MaxLength<940>,
        name: string & tags.MaxLength<20>,
        id: string & tags.Format<"uuid">,
        can_only_apply_once: boolean,
        questions: merged_question[],
        can_apply_in_game: boolean,
        requires_discord: boolean,
        auto_grade: boolean,
    }
}

export namespace form_submission {
    export type scale_question = {
        answer: number & tags.ExclusiveMaximum<10> & tags.ExclusiveMinimum<1> & tags.Type<"uint32">,
        type: question.scale & tags.Type<"uint32">,
    }
    
    export type multiple_choice_question = {
        answer: number & tags.Type<"uint32">,
        type: question.multiple_choice & tags.Type<"uint32">,
    }
    
    export type checkboxes_question = {
        answers: (number & tags.Type<"uint32">)[],
        type: question.checkboxes & tags.Type<"uint32">,
    }
    
    // assuming average word length is 4.7 characters
    export type essay_question = {
        answer: string & tags.MaxLength<3055>,
        type: question.essay & tags.Type<"uint32">,
    }
    
    export type paragraph_question = {
        answer: string & tags.MaxLength<940>,
        type: question.paragraph & tags.Type<"uint32">,
    }
    
    export type sentance_question = {
        answer: string & tags.MaxLength<94>,
        type: question.sentance & tags.Type<"uint32">,
    }
    
    export type merged_question = {
        answers?: (number & tags.Type<"uint32">)[],
        answer?: (string & tags.MaxLength<94>) | (string & tags.MaxLength<940>) | (string & tags.MaxLength<3055>) | 
            (number & tags.Type<"uint32">) | (number & tags.ExclusiveMaximum<10> & tags.ExclusiveMinimum<1> & tags.Type<"uint32">),
        type: number & tags.Type<"uint32">,
    }

    export interface form_submission {
        id: string & tags.Format<"uuid">,
        answers: merged_question[],
        user_id: bigint,
    }
}

function create_question_validator<T>(question_type: question): (<U>(value: U & {type: question}) => ({success: true, data: T} | {success: false, data: null})) {
    return (value: any) => {
        if (value.type === question_type) {
            return {success: true, data: value}
        } else {
            return {success: false, data: null}
        }
    }
}

export const form_info = Object.freeze({
    write: typia.protobuf.createEncode<form_info.form>(),
    read: typia.protobuf.createDecode<form_info.form>(),
    question: Object.freeze({
        is_multiple_choice: create_question_validator<form_info.multiple_choice_question>(question.multiple_choice),
        is_checkboxes: create_question_validator<form_info.checkboxes_question>(question.checkboxes),
        is_paragraph: create_question_validator<form_info.paragraph_question>(question.paragraph),
        is_sentance: create_question_validator<form_info.sentance_question>(question.sentance),
        is_scale: create_question_validator<form_info.scale_question>(question.scale),
        is_essay: create_question_validator<form_info.essay_question>(question.essay),
    }),
})

export const submission = Object.freeze({
    write: typia.protobuf.createEncode<form_submission.form_submission>(),
    read: typia.protobuf.createDecode<form_submission.form_submission>(),
    question: (form_info.question as unknown) as Readonly<{
        is_multiple_choice: typeof create_question_validator<form_submission.multiple_choice_question>,
        is_checkboxes: typeof create_question_validator<form_submission.checkboxes_question>,
        is_paragraph: typeof create_question_validator<form_submission.paragraph_question>,
        is_sentance: typeof create_question_validator<form_submission.sentance_question>,
        is_scale: typeof create_question_validator<form_submission.scale_question>,
        is_essay: typeof create_question_validator<form_submission.essay_question>,
    }>
})
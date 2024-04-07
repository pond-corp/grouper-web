import typia, { tags } from "typia";
// export type color = string & tags.Pattern<"/\b(hex(#?([0-9a-fA-F]{6})))|hct((d+(?:.d+)?),s*(d+(?:.d+)?),s*(d+(?:.d+)?)))\b/">;
type twenty_char_string = string & tags.MaxLength<20>;
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
export const validate = (input: any): typia.IValidation<config_template> => {
    const errors = [] as any[];
    const __is = (input: any, _exceptionable: boolean = true): input is config_template => {
        const $join = (typia.createValidateEquals as any).join;
        const $io0 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.name && input.name.length <= 20 && "bigint" === typeof input.id && ("object" === typeof input.event && null !== input.event && $io1(input.event, true && _exceptionable)) && ("object" === typeof input.places && null !== input.places && false === Array.isArray(input.places) && $io2(input.places, true && _exceptionable)) && ("object" === typeof input.forms && null !== input.forms && $io4(input.forms, true && _exceptionable)) && (undefined === input.socials || "object" === typeof input.socials && null !== input.socials && false === Array.isArray(input.socials) && $io5(input.socials, true && _exceptionable)) && (null !== input.theme && undefined !== input.theme && ("string" === typeof input.theme || "object" === typeof input.theme && null !== input.theme && $io6(input.theme, true && _exceptionable))) && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["name", "id", "event", "places", "forms", "socials", "theme"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io1 = (input: any, _exceptionable: boolean = true): boolean => (undefined === input.auto_delete_events_after || "string" === typeof input.auto_delete_events_after) && "number" === typeof input.minimum_high_rank && "number" === typeof input.minimum_rank && (undefined === input.check_if_events_are_full || "boolean" === typeof input.check_if_events_are_full) && (Array.isArray(input.types) && input.types.every((elem: any, _index1: number) => "string" === typeof elem && elem.length <= 20)) && (3 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["auto_delete_events_after", "minimum_high_rank", "minimum_rank", "check_if_events_are_full", "types"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io2 = (input: any, _exceptionable: boolean = true): boolean => Object.keys(input).every((key: any) => {
            const value = input[key];
            if (undefined === value)
                return true;
            if ("string" === typeof key && key.length <= 20)
                return "object" === typeof value && null !== value && $io3(value, true && _exceptionable);
            return false;
        });
        const $io3 = (input: any, _exceptionable: boolean = true): boolean => (undefined === input.use_direct_join_urls || "boolean" === typeof input.use_direct_join_urls) && "string" === typeof input.universe_id && "bigint" === typeof input.place_id && (undefined === input.is_main || "boolean" === typeof input.is_main) && (2 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["use_direct_join_urls", "universe_id", "place_id", "is_main"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io4 = (input: any, _exceptionable: boolean = true): boolean => (undefined === input.auto_delete_unreviewed_after || "string" === typeof input.auto_delete_unreviewed_after) && "number" === typeof input.minimum_create_and_destroy_rank && (undefined === input.auto_delete_reviewed_after || "string" === typeof input.auto_delete_reviewed_after) && "number" === typeof input.minimum_review_rank && (2 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["auto_delete_unreviewed_after", "minimum_create_and_destroy_rank", "auto_delete_reviewed_after", "minimum_review_rank"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io5 = (input: any, _exceptionable: boolean = true): boolean => (undefined === input.guilded || "string" === typeof input.guilded && /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu.test(input.guilded)) && (undefined === input.discord || "string" === typeof input.discord && /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu.test(input.discord)) && (0 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["guilded", "discord"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        const $io6 = (input: any, _exceptionable: boolean = true): boolean => "string" === typeof input.primary && "string" === typeof input.secondary && "string" === typeof input.tertiary && "string" === typeof input.error && "string" === typeof input.neutral && "string" === typeof input.neutral_variant && (6 === Object.keys(input).length || Object.keys(input).every((key: any) => {
            if (["primary", "secondary", "tertiary", "error", "neutral", "neutral_variant"].some((prop: any) => key === prop))
                return true;
            const value = input[key];
            if (undefined === value)
                return true;
            return false;
        }));
        return "object" === typeof input && null !== input && $io0(input, true);
    };
    if (false === __is(input)) {
        const $report = (typia.createValidateEquals as any).report(errors);
        ((input: any, _path: string, _exceptionable: boolean = true): input is config_template => {
            const $join = (typia.createValidateEquals as any).join;
            const $vo0 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.name && (input.name.length <= 20 || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "string & MaxLength<20>",
                    value: input.name
                })) || $report(_exceptionable, {
                    path: _path + ".name",
                    expected: "(string & MaxLength<20>)",
                    value: input.name
                }), "bigint" === typeof input.id || $report(_exceptionable, {
                    path: _path + ".id",
                    expected: "bigint",
                    value: input.id
                }), ("object" === typeof input.event && null !== input.event || $report(_exceptionable, {
                    path: _path + ".event",
                    expected: "__type",
                    value: input.event
                })) && $vo1(input.event, _path + ".event", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".event",
                    expected: "__type",
                    value: input.event
                }), ("object" === typeof input.places && null !== input.places && false === Array.isArray(input.places) || $report(_exceptionable, {
                    path: _path + ".places",
                    expected: "__type.o1",
                    value: input.places
                })) && $vo2(input.places, _path + ".places", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".places",
                    expected: "__type.o1",
                    value: input.places
                }), ("object" === typeof input.forms && null !== input.forms || $report(_exceptionable, {
                    path: _path + ".forms",
                    expected: "__type.o3",
                    value: input.forms
                })) && $vo4(input.forms, _path + ".forms", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".forms",
                    expected: "__type.o3",
                    value: input.forms
                }), undefined === input.socials || ("object" === typeof input.socials && null !== input.socials && false === Array.isArray(input.socials) || $report(_exceptionable, {
                    path: _path + ".socials",
                    expected: "(__type.o4 | undefined)",
                    value: input.socials
                })) && $vo5(input.socials, _path + ".socials", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".socials",
                    expected: "(__type.o4 | undefined)",
                    value: input.socials
                }), (null !== input.theme || $report(_exceptionable, {
                    path: _path + ".theme",
                    expected: "(__type.o5 | string)",
                    value: input.theme
                })) && (undefined !== input.theme || $report(_exceptionable, {
                    path: _path + ".theme",
                    expected: "(__type.o5 | string)",
                    value: input.theme
                })) && ("string" === typeof input.theme || ("object" === typeof input.theme && null !== input.theme || $report(_exceptionable, {
                    path: _path + ".theme",
                    expected: "(__type.o5 | string)",
                    value: input.theme
                })) && $vo6(input.theme, _path + ".theme", true && _exceptionable) || $report(_exceptionable, {
                    path: _path + ".theme",
                    expected: "(__type.o5 | string)",
                    value: input.theme
                })), 6 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["name", "id", "event", "places", "forms", "socials", "theme"].some((prop: any) => key === prop))
                        return true;
                    const value = input[key];
                    if (undefined === value)
                        return true;
                    return $report(_exceptionable, {
                        path: _path + $join(key),
                        expected: "undefined",
                        value: value
                    });
                }).every((flag: boolean) => flag))].every((flag: boolean) => flag);
            const $vo1 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.auto_delete_events_after || "string" === typeof input.auto_delete_events_after || $report(_exceptionable, {
                    path: _path + ".auto_delete_events_after",
                    expected: "(string | undefined)",
                    value: input.auto_delete_events_after
                }), "number" === typeof input.minimum_high_rank || $report(_exceptionable, {
                    path: _path + ".minimum_high_rank",
                    expected: "number",
                    value: input.minimum_high_rank
                }), "number" === typeof input.minimum_rank || $report(_exceptionable, {
                    path: _path + ".minimum_rank",
                    expected: "number",
                    value: input.minimum_rank
                }), undefined === input.check_if_events_are_full || "boolean" === typeof input.check_if_events_are_full || $report(_exceptionable, {
                    path: _path + ".check_if_events_are_full",
                    expected: "(boolean | undefined)",
                    value: input.check_if_events_are_full
                }), (Array.isArray(input.types) || $report(_exceptionable, {
                    path: _path + ".types",
                    expected: "Array<twenty_char_string>",
                    value: input.types
                })) && input.types.map((elem: any, _index1: number) => "string" === typeof elem && (elem.length <= 20 || $report(_exceptionable, {
                    path: _path + ".types[" + _index1 + "]",
                    expected: "string & MaxLength<20>",
                    value: elem
                })) || $report(_exceptionable, {
                    path: _path + ".types[" + _index1 + "]",
                    expected: "(string & MaxLength<20>)",
                    value: elem
                })).every((flag: boolean) => flag) || $report(_exceptionable, {
                    path: _path + ".types",
                    expected: "Array<twenty_char_string>",
                    value: input.types
                }), 3 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["auto_delete_events_after", "minimum_high_rank", "minimum_rank", "check_if_events_are_full", "types"].some((prop: any) => key === prop))
                        return true;
                    const value = input[key];
                    if (undefined === value)
                        return true;
                    return $report(_exceptionable, {
                        path: _path + $join(key),
                        expected: "undefined",
                        value: value
                    });
                }).every((flag: boolean) => flag))].every((flag: boolean) => flag);
            const $vo2 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [false === _exceptionable || Object.keys(input).map((key: any) => {
                    const value = input[key];
                    if (undefined === value)
                        return true;
                    if ("string" === typeof key && key.length <= 20)
                        return ("object" === typeof value && null !== value || $report(_exceptionable, {
                            path: _path + $join(key),
                            expected: "__type.o2",
                            value: value
                        })) && $vo3(value, _path + $join(key), true && _exceptionable) || $report(_exceptionable, {
                            path: _path + $join(key),
                            expected: "__type.o2",
                            value: value
                        });
                    return $report(_exceptionable, {
                        path: _path + $join(key),
                        expected: "undefined",
                        value: value
                    });
                }).every((flag: boolean) => flag)].every((flag: boolean) => flag);
            const $vo3 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.use_direct_join_urls || "boolean" === typeof input.use_direct_join_urls || $report(_exceptionable, {
                    path: _path + ".use_direct_join_urls",
                    expected: "(boolean | undefined)",
                    value: input.use_direct_join_urls
                }), "string" === typeof input.universe_id || $report(_exceptionable, {
                    path: _path + ".universe_id",
                    expected: "string",
                    value: input.universe_id
                }), "bigint" === typeof input.place_id || $report(_exceptionable, {
                    path: _path + ".place_id",
                    expected: "bigint",
                    value: input.place_id
                }), undefined === input.is_main || "boolean" === typeof input.is_main || $report(_exceptionable, {
                    path: _path + ".is_main",
                    expected: "(boolean | undefined)",
                    value: input.is_main
                }), 2 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["use_direct_join_urls", "universe_id", "place_id", "is_main"].some((prop: any) => key === prop))
                        return true;
                    const value = input[key];
                    if (undefined === value)
                        return true;
                    return $report(_exceptionable, {
                        path: _path + $join(key),
                        expected: "undefined",
                        value: value
                    });
                }).every((flag: boolean) => flag))].every((flag: boolean) => flag);
            const $vo4 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.auto_delete_unreviewed_after || "string" === typeof input.auto_delete_unreviewed_after || $report(_exceptionable, {
                    path: _path + ".auto_delete_unreviewed_after",
                    expected: "(string | undefined)",
                    value: input.auto_delete_unreviewed_after
                }), "number" === typeof input.minimum_create_and_destroy_rank || $report(_exceptionable, {
                    path: _path + ".minimum_create_and_destroy_rank",
                    expected: "number",
                    value: input.minimum_create_and_destroy_rank
                }), undefined === input.auto_delete_reviewed_after || "string" === typeof input.auto_delete_reviewed_after || $report(_exceptionable, {
                    path: _path + ".auto_delete_reviewed_after",
                    expected: "(string | undefined)",
                    value: input.auto_delete_reviewed_after
                }), "number" === typeof input.minimum_review_rank || $report(_exceptionable, {
                    path: _path + ".minimum_review_rank",
                    expected: "number",
                    value: input.minimum_review_rank
                }), 2 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["auto_delete_unreviewed_after", "minimum_create_and_destroy_rank", "auto_delete_reviewed_after", "minimum_review_rank"].some((prop: any) => key === prop))
                        return true;
                    const value = input[key];
                    if (undefined === value)
                        return true;
                    return $report(_exceptionable, {
                        path: _path + $join(key),
                        expected: "undefined",
                        value: value
                    });
                }).every((flag: boolean) => flag))].every((flag: boolean) => flag);
            const $vo5 = (input: any, _path: string, _exceptionable: boolean = true): boolean => [undefined === input.guilded || "string" === typeof input.guilded && (/^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu.test(input.guilded) || $report(_exceptionable, {
                    path: _path + ".guilded",
                    expected: "string & Format<\"url\">",
                    value: input.guilded
                })) || $report(_exceptionable, {
                    path: _path + ".guilded",
                    expected: "((string & Format<\"url\">) | undefined)",
                    value: input.guilded
                }), undefined === input.discord || "string" === typeof input.discord && (/^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu.test(input.discord) || $report(_exceptionable, {
                    path: _path + ".discord",
                    expected: "string & Format<\"url\">",
                    value: input.discord
                })) || $report(_exceptionable, {
                    path: _path + ".discord",
                    expected: "((string & Format<\"url\">) | undefined)",
                    value: input.discord
                }), 0 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["guilded", "discord"].some((prop: any) => key === prop))
                        return true;
                    const value = input[key];
                    if (undefined === value)
                        return true;
                    return $report(_exceptionable, {
                        path: _path + $join(key),
                        expected: "undefined",
                        value: value
                    });
                }).every((flag: boolean) => flag))].every((flag: boolean) => flag);
            const $vo6 = (input: any, _path: string, _exceptionable: boolean = true): boolean => ["string" === typeof input.primary || $report(_exceptionable, {
                    path: _path + ".primary",
                    expected: "string",
                    value: input.primary
                }), "string" === typeof input.secondary || $report(_exceptionable, {
                    path: _path + ".secondary",
                    expected: "string",
                    value: input.secondary
                }), "string" === typeof input.tertiary || $report(_exceptionable, {
                    path: _path + ".tertiary",
                    expected: "string",
                    value: input.tertiary
                }), "string" === typeof input.error || $report(_exceptionable, {
                    path: _path + ".error",
                    expected: "string",
                    value: input.error
                }), "string" === typeof input.neutral || $report(_exceptionable, {
                    path: _path + ".neutral",
                    expected: "string",
                    value: input.neutral
                }), "string" === typeof input.neutral_variant || $report(_exceptionable, {
                    path: _path + ".neutral_variant",
                    expected: "string",
                    value: input.neutral_variant
                }), 6 === Object.keys(input).length || (false === _exceptionable || Object.keys(input).map((key: any) => {
                    if (["primary", "secondary", "tertiary", "error", "neutral", "neutral_variant"].some((prop: any) => key === prop))
                        return true;
                    const value = input[key];
                    if (undefined === value)
                        return true;
                    return $report(_exceptionable, {
                        path: _path + $join(key),
                        expected: "undefined",
                        value: value
                    });
                }).every((flag: boolean) => flag))].every((flag: boolean) => flag);
            return ("object" === typeof input && null !== input || $report(true, {
                path: _path + "",
                expected: "config_template",
                value: input
            })) && $vo0(input, _path + "", true) || $report(true, {
                path: _path + "",
                expected: "config_template",
                value: input
            });
        })(input, "$input", true);
    }
    const success = 0 === errors.length;
    return {
        success,
        errors,
        data: success ? input : undefined
    } as any;
};

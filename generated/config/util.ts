type optional_keys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];
type defaults<T> = Required<Pick<T, optional_keys<T>>>;
// option class for applying defualts to a config
class options<T extends object, U extends defaults<T>> {
    private defualts: U;
    public apply_defualts(obj: Partial<T>): Required<T> {
        return Object.assign({}, this.defualts, obj) as any;
    }
    constructor(options: T, defualts: U) {
        this.defualts = defualts;
    }
}
export default options;

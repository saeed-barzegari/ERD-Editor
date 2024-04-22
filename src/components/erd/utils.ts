export { }
declare global {
    interface Array<T> {
        exists(index: number): boolean;

        move(from: number, to: number): boolean;

        up(index: number): boolean;

        left(index: number): boolean;

        right(index: number): boolean;

        down(index: number): boolean;

        start(): any;

        first(): any;

        last(): any;

        end(): any;

        get(index: number, _default: any): any;

        remove(index: number): boolean;

        isEmpty(): boolean;

        empty(): boolean;

        shuffle(): Array<any>;

        sum(): number;

        column(col: number): Array<any>;

        replace(from: Array<any>, to: Array<any>): Array<any>;
    }
}

/**
 * Check if item exists by index
 *
 * @param {integer} index
 * @return boolean
 * */
Array.prototype.exists = function (index: number): boolean {
    return typeof this[index] !== 'undefined';
};
/**
 * Move a item by index position to a new index position
 *
 * @param {integer} from
 * @param {integer} to
 * @return boolean
 * */
Array.prototype.move = function (from: number, to: number): boolean {
    if (!this.exists(from) || !this.exists(to)) return false;
    const total = this.length;
    while (from < 0) from += total;
    while (to < 0) to += total;
    if (to >= total) {
        let i = to - total;
        while ((i--) + 1) this.push(undefined);
    }
    return this.splice(to, 0, this.splice(from, 1)[0]).length == 0
};
/**
 * Move item to left position by index
 *
 * @param {integer} index
 * @return boolean
 * */
Array.prototype.up = Array.prototype.left = function (index: number): boolean {
    return this.exists(index - 1) && this.move(index, index - 1);
};
/**
 * Move item to right position by index
 *
 * @param {integer} index
 * @return boolean
 * */
Array.prototype.down = Array.prototype.right = function (index: number): boolean {
    return this.exists(index + 1) && this.move(index, index + 1);
};
/**
 * Get the first item
 *
 * @param {integer} index
 * @return any
 * */
Array.prototype.first = Array.prototype.start = function (): any {
    return this[0];
};
/**
 * Get the last item
 *
 * @param {integer} index
 * @return any
 * */
Array.prototype.last = Array.prototype.end = function (): any {
    return this[this.length - 1];
};
/**
 * Get a item, if it not exists, return you own default value
 *
 * @param {integer} index
 * @param {*} _default
 * @return any
 * */
Array.prototype.get = function (index: number, _default: void): any {
    return this.exists(index) ? this[index] : _default
};
/**
 * Remove a item by index
 *
 * @param {integer} index
 * @return boolean
 * */
Array.prototype.remove = function (index: number): boolean {
    return this.splice(index, 1).length > 0;
};
/**
 * Check if a empty Array
 *
 * @return boolean
 * */
Array.prototype.isEmpty = function (): boolean {
    return this.length === 0
};
/**
 * Truncate Array
 *
 * @return boolean
 * */
Array.prototype.empty = function (): boolean {
    return this.splice(0, this.length).length > 0
}
/**
 * Shuffle array
 *
 * @return array
 * */
Array.prototype.shuffle = function (): Array<any> {
    let temp, j, i = this.length;
    while (--i) {
        j = ~~(Math.random() * (i + 1));
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this;
}
/**
 * Calculate the sum of values
 *
 * @return number
 * */
Array.prototype.sum = function (): number {
    return this.reduce((x: number, y: number) => {
        return Number(x) + Number(y);
    });
};
/**
 * Return the values from a single column
 *
 * @param {number} col - Column index
 * @return array
 * */
Array.prototype.column = function (col: number): Array<any> {
    return this.map(x => x[col])
};
/**
 * Replace items fro new value is equal to ...
 *
 * @param {array} from
 * @param {array} to
 * @return array
 * */
Array.prototype.replace = function (from: Array<any>, to: Array<any>) {
    this.forEach((value, index) => {
        const fromIndex = from.indexOf(value);
        if (fromIndex !== -1 && to.exists(index)) this[index] = to[index];
    });
    return this;
};
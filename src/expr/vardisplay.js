// Display variants need to not be subclasses to not confuse the fader
class DisplayChest extends Expression {
    constructor(name, expr) {
        super([expr]);
        this.name = name;
        this.childPos = { x: 10, y: 5 };

        if (!expr) return;
        expr.ignoreEvents = true;
        expr.scale = { x: 0.6, y: 0.6 };
        expr.anchor = { x: -0.1, y: 0.5 };
    }

    open() {}
    close() {}

    setExpr(expr) {
        this.holes[0] = expr;
        expr.ignoreEvents = true;
        expr.scale = { x: 0.6, y: 0.6 };
        // expr.anchor = { x: -0.1, y: 0.5 };
    }

    getExpr() {
        return this.holes[0];
    }

    performReduction() {}

    prepareAssign() {
        let target = {
            childPos: {
                x: 10,
                y: -200,
            },
        };
        return Animate.tween(this, target, 600).after(() => {
            this.childPos = { x: 10, y: 5 };
        });
    }

    drawInternal(ctx, pos, boundingSize) {
        let size = this._size;
        let scale = this.absoluteScale;
        let adjustedSize = this.absoluteSize;
        let offsetX = (adjustedSize.w - size.w) / 2;
        ctx.drawImage(ChestImages.lidOpen(this.name), pos.x + offsetX, pos.y, size.w * scale.x, size.h * scale.y);
        this.holes[0].pos = {
            x: this.childPos.x,
            y: this.childPos.y,
        };
    }

    drawInternalAfterChildren(ctx, pos, boundingSize) {
        let size = this._size;
        let scale = this.absoluteScale;
        let adjustedSize = this.absoluteSize;
        let offsetX = (adjustedSize.w - size.w) / 2;
        ctx.drawImage(ChestImages.base(this.name), pos.x + offsetX, pos.y, size.w * scale.x, size.h * scale.y);
    }
}

class LabeledDisplayChest extends DisplayChest {
    constructor(name, expr) {
        super(name, expr);
        this.childPos = { x: 22.5, y: 5 };
        this.label = new TextExpr(name);
        this.label.color = 'white';
        this.holes.push(this.label);
    }

    drawInternal(ctx, pos, boundingSize) {
        super.drawInternal(ctx, pos, boundingSize);
        this.label.pos = {
            x: this.size.w / 2 - this.label.absoluteSize.w / 2,
            y: this.size.h / 2,
        };
    }

    draw(ctx) {
        if (!ctx) return;
        ctx.save();
        if (this.opacity !== undefined && this.opacity < 1.0) {
            ctx.globalAlpha = this.opacity;
        }
        var boundingSize = this.absoluteSize;
        var upperLeftPos = this.upperLeftPos(this.absolutePos, boundingSize);
        this.drawInternal(ctx, upperLeftPos, boundingSize);
        this.holes[0].parent = this;
        this.holes[0].draw(ctx);
        this.drawInternalAfterChildren(ctx, upperLeftPos, boundingSize);
        this.label.parent = this;
        this.label.draw(ctx);
        ctx.restore();
    }
}

class LabeledDisplay extends Expression {
    constructor(name, expr) {
        super([]);
        this.name = name;
        this.nameLabel = new TextExpr(name);
        this.nameLabel.color = 'white';
        this.equals = new TextExpr("=");
        this.equals.color = 'white';
        this.value = expr;
        this.addArg(this.nameLabel);
        this.addArg(this.equals);
        this.addArg(this.value);
        this.setExpr(expr);
        this.origValue = null;
    }

    open(preview) {
        if (!this.origValue) {
            this.origValue = this.value;
            this.setExpr(preview);
        }
    }

    close() {
        if (this.origValue) {
            this.setExpr(this.origValue);
            this.origValue = null;
        }
    }

    getExpr() {
        if (this.origValue) {
            return this.origValue;
        }
        return this.holes[2];
    }

    setExpr(expr) {
        if (this.holes.length < 3) return;
        expr.pos = { x: 0, y: 0 };
        this.holes[2] = expr;
        expr.scale = { x: 1.0, y: 1.0 };
        expr.anchor = { x: 0, y: 0.5 };
        expr.stroke = null;
        expr.ignoreEvents = true;
        expr.parent = this;
        this.value = expr;
        this.update();
    }

    drawInternal(ctx, pos, boundingSize) {}
}

class Food {
    constructor(x, y, color, type = "apple"){
        this.x = x;
        this.y = y;
        this.color = color;
        this.type = type;
    }

    changeColor(color){
        this.color = color;
    }
}
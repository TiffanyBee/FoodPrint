const DATA_URL = "https://ourworldindata.org/grapher/ghg-per-protein-poore.metadata.json?v=1&csvType=full&useColumnShortNames=true";

var Recipes = []
function Recipe(name, ingredients, data) {
    this.name = name;
    this.ingredients = ingredients;
    this.data = data;
    this.info = function() {
        return [ name, ingredients, data]
    }
}

function Ingredient(food, amount, unit, fullIngredient) {
    this.food = food;
    this.amount = amount;
    this.unit = unit;
    this.fullIngredient = fullIngredient;
    this.info = function() {
        return [ food, amount, unit, fullIngredient ]
    }
}

document.getElementById("analyze").addEventListener("click", analyzeRecipe);

function analyzeRecipe() {
    var recipeNameInput = document.getElementById("recipe-name");
    var recipeName = recipeNameInput.value
    var ingredientsInput = document.getElementById("ingredients")

    // turning recipe ingredients into elements in array
    ingredientsInput = ingredientsInput.value.split("\n");
    for (let i = 0; i < ingredientsInput.length; i++) {
        if (ingredientsInput[i] == "") {
            ingredientsInput.splice(i, 1);
        }
    }
    console.log (ingredientsInput);

    //parsing the ingredients into objects
    var ingredients = [];
    for (let i = 0; i < ingredientsInput.length; i++) {
        var fullIngredient = ingredientsInput[i];
        var tempIngredient = fullIngredient;

        var amount;
        var unit;
        var food;

        //remove unnecesary informaiton: paranthesis, commas, or, of
        if (tempIngredient.includes("(")) {
            tempIngredient = tempIngredient.replace(/\([^)]*\)/g, ""); 
        }
        if (tempIngredient.includes(",")) {
            tempIngredient = tempIngredient.split(',')[0];
        }
        if (tempIngredient.includes("or")) {
            tempIngredient = tempIngredient.split('or')[tempIngredient.length];
        }
        if (tempIngredient.includes("of")) {
            tempIngredient = tempIngredient.replace("of", "");
        }

        //easier to parse as a list
        tempIngredient = tempIngredient.split(" ");


        //testing if 1st and 2nd word are numbers to calculate amount 

        if (/\d/g.test(tempIngredient[0])) {
            console.log(tempIngredient[0])
            try {
                amount = parseFloat(eval(tempIngredient[0]));
            } catch {
                console.log("cannot evaluate");
                amount = 1;
            }
            tempIngredient.splice(0, 1);
        }
        if (/\d/g.test(tempIngredient[1])) {
            console.log(tempIngredient[1]);
            try {
                amount += eval(tempIngredient[1]);
            } catch {
                console.log("cannot evaluate");
                //amount stays the same
            }
            tempIngredient.splice(0, 1);
        }
        
       
        console.log(tempIngredient);
        
        unit = tempIngredient[0];
        tempIngredient.splice(0, 1);

        food = tempIngredient.join(" ").trim();

        var ingredient = new Ingredient(food, amount, unit, fullIngredient);
        console.log(ingredient.info());
        ingredients.push(new Ingredient(food, amount, unit, fullIngredient));

    }
    Recipes.push(new Recipe(recipeName, ingredients));

}


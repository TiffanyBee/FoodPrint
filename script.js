// object of units, the numbers being their conversion to kilograms
const units = {
    gram: .001,
    grams: .001,
    g: .001,

    kilogram: 1,
    kilograms: 1,
    kg: 1,

    ounce: 0.02835,
    ounces: 0.02835,
    oz: 0.02835,

    pound: .4536,
    pounds: .4536,
    lb: .4536,
    lbs: .4536,

    teaspoon: .005,
    teaspoons: .005,
    tsp: .005,

    tablespoon: .015,
    tablespoons: .015,
    tbsp: .015,

    cup: 2.40,
    cups: 2.40

}

function parseQuantity(numberString) {
    let num = 0
    if (numberString.includes(" ")) {
        let parts = numberString.split(" ")
        let whole = parseInt(parts[0]);
        let fraction = eval(parts[1]);
        num += whole + fraction
        print(num, "complex fraction")
    }
        // if just fraction
    else if (numberString.includes("/")) {
        num += eval(numberString)
        print(num, "fraction")
    }
    else {
        num += parseFloat(numberString)
        print(num, "regular")
    }
    return num   
    
}

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
    const kilograms = units[unit]
    this.info = function() {
        return [ food, amount, unit, fullIngredient, kilograms ]
    }
}

document.getElementById("analyze").addEventListener("click", analyzeRecipe);

function analyzeRecipe() {
    var recipeNameInput = document.getElementById("recipe-name");
    var recipeName = recipeNameInput.value
    var ingredientsInput = document.getElementById("ingredients").value.toLowerCase().trim();
    console.log(ingredientsInput)
    // turning recipe ingredients into elements in array
    ingredientsInput = ingredientsInput.split("\n");
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

        var amount = 0;
        var unit = null;
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


        // find amount


        // identifies 1 1/2, 1/2, 1
        amountstr  = tempIngredient.match(
            /(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)/
        )[0].trim()

        amount = parseQuantity(amountstr);
        print(amount)
        tempIngredient = tempIngredient.replace(amountstr, "").trim()

        print(amountstr)
        
        
        
        print(tempIngredient)
        

        // find unit value, if any
        for (const possibleUnit in units) 
            {
            if (tempIngredient.startsWith(possibleUnit + " ")) {
                unit = possibleUnit;
                tempIngredient = tempIngredient.slice(unit.length)

                break;
            }
        }
        if (!unit) {
            unit = "item"
        }

        // the rest will be food
        food = tempIngredient.trim();

        var ingredient = new Ingredient(food, amount, unit, fullIngredient);
        console.log(ingredient.info());
        ingredients.push(new Ingredient(food, amount, unit, fullIngredient));

        //

    }
    Recipes.push(new Recipe(recipeName, ingredients));

}


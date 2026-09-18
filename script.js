//import Papa from 'papaparse';

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

    "tablespoon": .015,
    tablespoons: .015,
    tbsp: .015,

    cup: 2.40,
    cups: 2.40

}

const csv_file = "test_footprint_of_foods.csv" 
var food_footprints = [];
function parseCSV(data) {
    const parsed = Papa.parse(data, {
        header: true,
        skipEmptyLines: true,

        transform: (value, headerName) => {
            if (headerName == "C02_per_kg") {
                return parseFloat(value)
            }
            else {
                return value.toLowerCase()
            }
        }
    })
    return parsed
}


fetch(csv_file)
    .then(response => response.text())
    .then(data => {
        food_footprints = parseCSV(data).data
       
        console.log(food_footprints)
    })


function getCarbonFootprint(user_food, amount_kg) {
    console.log(user_food)
    matchedFood = food_footprints.find((foodprint) => foodprint.food_name == user_food)
    console.log(matchedFood)

    console.log(matchedFood.C02_per_kg * amount_kg)
   
}

function parseQuantity(numberString) {
    let num = 0
    if (numberString.includes(" ")) {
        let parts = numberString.split(" ")
        let whole = parseInt(parts[0]);
        let fraction = eval(parts[1]);
        num += whole + fraction
        
    }
        // if just fraction
    else if (numberString.includes("/")) {
        num += eval(numberString)
        
    }
    else {
        num += parseFloat(numberString)
       
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
    this.amountkg = amount * units[unit]


    // find carbon footprint
    //console.log(this.unit)
    const matchedFood = food_footprints.find((foodprint) => foodprint.food_name == food)
    if (matchedFood != undefined) {
        this.carbonFootprint = this.amountkg * matchedFood.C02_per_kg
    } else {
        this.carbonFootprint = null
    }
    
    
    this.info = function() {
        return [ food, amount, unit, fullIngredient ]
    }
}


// when analyze is clicked save values of ingredients 
document.getElementById("analyze-recipe").addEventListener("click", analyzeRecipe);
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
        tempIngredient = tempIngredient.replace(amountstr, "").trim()
        

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
        console.log(unit)

        // the rest will be food
        food = tempIngredient.trim();

        var ingredient = new Ingredient(food, amount, unit, fullIngredient);
        console.log(ingredient.info());
        ingredients.push(new Ingredient(food, amount, unit, fullIngredient));

        //

    }
    Recipes.push(new Recipe(recipeName, ingredients));

}


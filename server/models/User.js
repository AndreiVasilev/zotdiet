class User {
  constructor(id, firstName, lastName, picture) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.picture = picture;
    this.gender = '';
    this.age = '';
    this.height = 0;
    this.targetWeight = 0;
    this.currentWeight = 0;
    this.pace = '';
    this.dietRestrictions = [];
    this.foodAllergies = [];
    this.cuisinePreferences = [];
    this.likedMeals = [];
    this.dislikedMeals = [];
  }
}

module.exports = {User};

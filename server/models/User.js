class User {
  constructor(id, firstName, lastName, picture) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.picture = picture;
    this.gender = '';
    this.dietRestrictions = [];
    this.foodAllergies = [];
    this.cuisinePreferences = [];
  }
}

module.exports = {User};

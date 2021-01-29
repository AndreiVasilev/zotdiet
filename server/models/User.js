class User {
  constructor(id, firstName, lastName, email, picture) {
    this._id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.picture = picture;
    this.gender = '';
    this.dietRestrictions = [];
    this.foodAllergies = [];
    this.cuisinePreferences = [];
  }
}

module.exports = {User};

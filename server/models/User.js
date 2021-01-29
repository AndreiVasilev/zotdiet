class User {
  constructor(id, firstName, lastName, picture) {
    this._id = id;
    this._firstName = firstName;
    this._lastName = lastName;
    this._picture = picture;
    this.gender = '';
    this.dietRestrictions = [];
    this.foodAllergies = [];
    this.cuisinePreferences = [];
  }
  
  get id() {
    return this._id;
  }

  get firstName() {
    return this._firstName;
  }

  get lastName() {
    return this._lastName;
  }

  get picture() {
    return this._picture;
  }
}

module.exports = {User};

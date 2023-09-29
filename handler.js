'use strict'
var _ = require('underscore')
var lodash = require('lodash')
const axios = require('axios')


//Google API Version

module.exports.getGoogleNearPlaces = async (event) => {

  var placeName = []
  var photoReference;
  var temp;


  var restaurantResponse = await this.getNearestLocation(event, 'restaurant')
  restaurantResponse.data.results.forEach((place) => {


    // Needs to filters out restaurants that do not have a photo
    // Currently just lets photoReference be added to thePlace
    temp = place.photos

    if (temp != undefined){
      photoReference = temp[0]["photo_reference"]
      //console.log(place.name)
      //console.log(temp[0]["photo_reference"])
    } else{
      //Will need to set undefined photos to a default image
      //console.log("No Photo Available")
    }
    

    const thePlace = {
      photo_reference: photoReference, //returns photo reference
      place: place.name,               //returns restaurant name
      //rating: place.rating,             //returns rating if available
      //price: place.price_level          //returns price level if available (ranges from 0-4)
    }

    if (isDuplicate(placeName, place.name) === false) {
        placeName.push(thePlace)
    }

  })

 //Displays in console
console.log(placeName)


//Returns Places
  return {
    statusCode: 200,
    body: JSON.stringify(placeName)
  }
}



function isDuplicate (array, keyvalue) {
  var picked = lodash.filter(array, { place: keyvalue })
  // return picked[0].place
  if (picked[0]) { return true }
  return false
}


 // location type must be exact with documentation found here https://developers.google.com/maps/documentation/places/web-service/supported_types 
 // Google API Key AIzaSyCS8aI1nmZgpGkizxDUYj7nAw7qhkv2c3Q
 module.exports.getNearestLocation = async (event, locationType) => {

   //Will need to get users lat and long this is just an example location 
  var lat = 36.1179865489448
  var long = -115.16894030514595
    
  var locationResponse = await axios({
    url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + ',' + long + '&rankby=distance&type=' + locationType + '&key=AIzaSyCS8aI1nmZgpGkizxDUYj7nAw7qhkv2c3Q&',
   
    method: 'GET'
  })

  return locationResponse

 }
 

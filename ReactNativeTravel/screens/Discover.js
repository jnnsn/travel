import { View, SafeAreaView, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useNavigation } from '@react-navigation/native'
import MenuContainer from '../components/MenuContainer';
import { Avatar, NotFound, Hotels, Attractions, Restaurants } from '../assets';
import { FontAwesome } from '@expo/vector-icons';
import ItemCardContainer from '../components/ItemCardContainer';
import { getPlacesData } from '../api';
const config = require('../config');

const Discover = () => {

  const navigation = useNavigation()

  const [type, setType] = useState("restaurants")
  const [isLoading, setIsLoading] = useState(false);
  const [mainData, setMainData] = useState([]);
  const [bl_lat, setBl_lat] = useState(null);
  const [bl_lng, setBl_lng] = useState(null);
  const [tr_lat, setTr_lat] = useState(null);
  const [tr_lng, setTr_lng] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    })
  }, [])

  useEffect(() => {
    setIsLoading(true);
    getPlacesData(bl_lat, bl_lng, tr_lat, tr_lng, type).then(data => {
      setMainData(data);
      setInterval(() => {
        setIsLoading(false);
      }, 2000);
    })
  }, [bl_lat, bl_lng, tr_lat, tr_lng, type])



  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <View className="flex-row items-center justify-between px-8">
        <View>
          <Text className="text-[40px] text-[#F28482] font-bold">Discover</Text>
          <Text className="text-[#F5CAC3] text-[30px]">the beauty today</Text>
        </View>
        <View className="w-12 h-12 transparent rounded-md items-center justify-center">
          <Image
            source={Avatar}
            className="w-full h-full rounded-md object-cover shadow-lg"
          />
        </View>
      </View>
      <View className="flex-row items-center bg-white mx-4 rounded-xl py-1 px-4 shadow-lg mt-4">
        <GooglePlacesAutocomplete
          GooglePlacesDetailsQuery={{ fields: "geometry" }}
          placeholder='Search'
          fetchDetails={true}
          onPress={(data, details = null) => {
            console.log(details?.geometry?.viewport);
            setBl_lat(details?.geometry?.viewport?.southwest?.lat)
            setBl_lng(details?.geometry?.viewport?.southwest?.lng)
            setTr_lat(details?.geometry?.viewport?.northeast?.lat)
            setTr_lng(details?.geometry?.viewport?.northeast?.lng)
          }}
          query={{
            key: config.googleApiKey,
            language: 'en',
          }}
        />
      </View>

      {isLoading ? <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#F5CAC3" />
      </View> :
        <ScrollView >
          <View className="flex-row items-center text-[#F28482] justify-between px-8 mt-8">
            <MenuContainer
              key={"hotels"}
              title={"Hotels"}
              imageSrc={Hotels}
              type={type}
              setType={setType}
            />
            <MenuContainer
              key={"attractions"}
              title={"Attractions"}
              imageSrc={Attractions}
              type={type}
              setType={setType}
            />
            <MenuContainer
              key={"restaurants"}
              title={"Restaurants"}
              imageSrc={Restaurants}
              type={type}
              setType={setType}
            />
          </View>

          <View>
            <View className="flex-row items-center justify-between px-4 mt-8">
              <Text className="text-[#F28482] text-[29px] font-bold">
                Top Tips
              </Text>
              <TouchableOpacity className="flex-row items-center justify-center space-x-2">
                <Text className="text-[#F5CAC3] text-[20px] font-bold">
                  Explore
                </Text>
                <FontAwesome name="long-arrow-right" size={24} color="#A0C4c7" />
              </TouchableOpacity>
            </View>
            {mainData?.length > 0 ? (
              <>
                <View className="px-4 mt-8 flex-row items-center justify-evenly flex-wrap">
                  {mainData?.map((data, index) => (
                    <ItemCardContainer
                      key={index}
                      imageSrc={
                        data?.photo?.images?.medium?.url
                          ? data?.photo?.images?.medium?.url
                          : "https://static.vecteezy.com/system/resources/previews/005/129/729/original/cute-cat-eat-ramen-cartoon-icon-illustration-animal-food-icon-concept-isolated-premium-flat-cartoon-style-vector.jpg"
                      }
                      title={data?.name}
                      location={data?.location_string}
                      data={data}
                    />
                  ))}
                </View>

              </>
            ) : (
              <>
                <View className="w-full h-[400px] items-center space-y-8 justify-center">
                  <Image source={NotFound} className="w-32 h-32 object-cover" />
                  <Text className="text-2xl text-[#a8a7a6] font-semibold">
                    No data found. Please try again later!
                  </Text>
                </View>
              </>
            )}

          </View>

        </ScrollView>
      }
    </SafeAreaView>
  )
}

export default Discover
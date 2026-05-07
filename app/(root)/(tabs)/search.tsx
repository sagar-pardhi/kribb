import FilterModal from "@/components/filter-modal";
import PropertyCard from "@/components/property-card";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { useFilterStore } from "@/store/filterStore";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  const {
    search,
    type,
    bedrooms,
    maxPrice,
    minPrice,
    setSearch,
    setMinPrice,
    setBedrooms,
    setMaxPrice,
    setType,
  } = useFilterStore();

  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { openFilters } = useLocalSearchParams<{ openFilters?: string }>();

  useEffect(() => {
    if (openFilters) {
      setShowFilters(true);
    }
  }, [openFilters]);

  useEffect(() => {
    fetchResults();
  }, [search, type, minPrice, maxPrice, bedrooms]);

  const activeFilterCount = [
    type !== null,
    bedrooms !== null,
    minPrice !== null,
    maxPrice !== null,
  ].filter(Boolean).length;

  const fetchResults = async () => {
    setLoading(true);

    let query = supabase.from("properties").select("*");

    if (search) {
      query = query.or(`title.ilike.%${search}%,city.ilike.%${search}%`);
    }

    if (type) {
      query = query.eq("type", type);
    }

    if (bedrooms) {
      query = query.eq("bedrooms", bedrooms);
    }

    if (minPrice) {
      query = query.gte("price", minPrice);
    }

    if (maxPrice) {
      query = query.lte("price", maxPrice);
    }

    const { data } = await query.order("created_at", {
      ascending: false,
    });

    setResults(data ?? []);
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-5 pt-4 pb-3">
        <Text className="mb-4 text-2xl font-bold text-gray-900">
          Find Property
        </Text>

        <View className="flex-row items-center gap-3">
          <View
            className="flex-row items-center flex-1 gap-3 px-4 bg-white rounded-2xl"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <Ionicons name="search-outline" size={18} color="#9ca3af" />
            <TextInput
              className="flex-1 py-3 text-gray-800"
              placeholder="Search by title or city"
              placeholderTextColor="#9ca3af"
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
            />

            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={18} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            className={`w-12 h-12 rounded-2xl items-center justify-center ${activeFilterCount > 0 ? "bg-blue-600" : "bg-white"}`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 6,
              elevation: 2,
            }}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={activeFilterCount > 0 ? "#fff" : "#374151"}
            />
            {activeFilterCount > 0 && (
              <View className="absolute items-center justify-center w-4 h-4 bg-red-500 rounded-full -top-1 -right-1">
                <Text className="text-white text-[9px] font-bold">
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Filter chips */}
        {activeFilterCount > 0 && (
          <View className="flex-row flex-wrap gap-2 mt-3">
            {type && (
              <View className="flex-row items-center gap-1 px-3 py-1 border border-blue-200 rounded-full bg-blue-50">
                <Text className="text-xs font-semibold text-blue-700 capitalize">
                  {type}
                </Text>
                <TouchableOpacity onPress={() => setType(null)}>
                  <Ionicons name="close" size={12} color="#1D4ed8" />
                </TouchableOpacity>
              </View>
            )}

            {bedrooms !== null && (
              <View className="flex-row items-center gap-1 px-3 py-1 border border-blue-200 rounded-full bg-blue-50">
                <Ionicons name="bed-outline" size={11} color="#1d4ed8" />
                <Text className="text-xs font-semibold text-blue-700 capitalize">
                  {bedrooms === 4
                    ? "4+ beds"
                    : `${bedrooms} bed${bedrooms > 1 ? "s" : ""}`}
                </Text>
                <TouchableOpacity onPress={() => setBedrooms(null)}>
                  <Ionicons name="close" size={12} color="#1D4ed8" />
                </TouchableOpacity>
              </View>
            )}

            {(minPrice !== null || maxPrice !== null) && (
              <View className="flex-row items-center gap-1 px-3 py-1 border border-blue-200 rounded-full bg-blue-50">
                <Text className="text-xs font-semibold text-blue-700 capitalize">
                  {minPrice && maxPrice
                    ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
                    : minPrice
                      ? `From ${formatPrice(minPrice)}`
                      : `Up to ${formatPrice(maxPrice!)}`}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setMinPrice(null);
                    setMaxPrice(null);
                  }}
                >
                  <Ionicons name="close" size={12} color="#1D4ed8" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100, padding: 20 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text className="mb-4 text-sm text-gray-400">
            {loading ? "Searching..." : `${results.length} properties found`}
          </Text>
        }
        renderItem={({ item }) => <PropertyCard property={item} />}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center py-10">
              <Text className="text-gray-400">No properties found</Text>
              <Text className="mt-1 text-sm text-gray-300">
                Try a different search or adjust filters
              </Text>
            </View>
          ) : (
            <ActivityIndicator size="large" color="#2563eb" className="py-20" />
          )
        }
      />

      {/* Filter modal */}
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </SafeAreaView>
  );
}

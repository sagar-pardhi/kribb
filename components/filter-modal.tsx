import { PropertyType, useFilterStore } from "@/store/filterStore";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const TYPES: { label: string; value: PropertyType }[] = [
  { label: "All", value: null },
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
  { label: "Villa", value: "villa" },
  { label: "Studio", value: "studio" },
];

const BEDS = [
  { label: "Any", value: null },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4+", value: 4 },
];

const PRICE_PRESETS = [
  { label: "Under ₹50L", min: null, max: 5000000 },
  { label: "₹50L – ₹1Cr", min: 5000000, max: 10000000 },
  { label: "₹1Cr – ₹2Cr", min: 10000000, max: 20000000 },
  { label: "Above ₹2Cr", min: 20000000, max: null },
];

const chip = (active: boolean) =>
  `px-4 py-2 rounded-full border ${
    active ? "bg-blue-600 border-blue-600" : "bg-white border-gray-200"
  }`;

const chipText = (active: boolean) =>
  `text-sm font-semibold ${active ? "text-white" : "text-gray-600"}`;

export default function FilterModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const {
    search,
    type,
    bedrooms,
    maxPrice,
    minPrice,
    setSearch,
    setType,
    setBedrooms,
    setMaxPrice,
    setMinPrice,
    resetFilters,
  } = useFilterStore();

  const [localMin, setLocalMin] = useState(minPrice ? String(minPrice) : "");
  const [localMax, setLocalMax] = useState(maxPrice ? String(maxPrice) : "");

  const shadow = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  };
  const activeCount = [type, bedrooms, minPrice, maxPrice].filter(
    (v) => v != null,
  ).length;

  const handleApply = () => {
    setMinPrice(localMin ? Number(localMin) : null);
    setMaxPrice(localMax ? Number(localMax) : null);
    onClose();
  };

  const handleReset = () => {
    setLocalMin("");
    setLocalMax("");
    resetFilters();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-50">
        <View className="flex-row items-center justify-between px-5 pt-6 pb-4 bg-white border-b border-gray-100">
          <TouchableOpacity onPress={onClose} className="p-1">
            <Ionicons name="close" size={22} color="#374151" />
          </TouchableOpacity>

          <Text className="text-lg font-bold text-gray-900">Filters</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text className="text-sm font-semibold text-blue-600">Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="mb-3 text-base font-bold text-gray-800">
            Property Type
          </Text>

          <View className="flex-row flex-wrap gap-2 mb-6">
            {TYPES.map((item) => (
              <TouchableOpacity
                key={String(item.value)}
                onPress={() => setType(item.value)}
                className={chip(type === item.value)}
                style={shadow}
              >
                <Text className={chipText(type === item.value)}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="mb-3 text-base font-bold text-gray-800">
            Bedrooms
          </Text>

          <View className="flex-row flex-wrap gap-2 mb-6">
            {BEDS.map((item) => (
              <TouchableOpacity
                key={String(item.value)}
                onPress={() => setBedrooms(item.value)}
                className={`flex-1 items-center py-3 rounded-2xl border ${chip(bedrooms === item.value)}`}
                style={shadow}
              >
                <Text
                  className={`${chipText(bedrooms === item.value)} text-sm font-bold`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="mb-3 text-base font-bold text-gray-800">
            Price Range (₹)
          </Text>

          <View className="flex-row gap-3 mb-3">
            {[
              {
                label: "Min Price",
                value: localMin,
                onChange: setLocalMin,
                placeholder: "0",
              },
              {
                label: "Max Price",
                value: localMax,
                onChange: setLocalMax,
                placeholder: "Any",
              },
            ].map(({ label, value, onChange, placeholder }) => (
              <View key={label} className="flex-1">
                <Text className="text-xs text-gray-500 mb-1.5 font-medium">
                  {label}
                </Text>

                <View
                  className="flex-row items-center px-3 bg-white border border-gray-200 rounded-2xl"
                  style={shadow}
                >
                  <Text className="mr-1 text-sm text-gray-400">₹</Text>
                  <TextInput
                    className="flex-1 py-3 text-gray-800"
                    placeholder={placeholder}
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChange}
                  />
                </View>
              </View>
            ))}
          </View>

          <View className="flex-row flex-wrap gap-2 mb-6">
            {PRICE_PRESETS.map((item) => {
              const active = minPrice === item.min && maxPrice === item.max;

              return (
                <TouchableOpacity
                  key={item.label}
                  onPress={() => {
                    setLocalMin(item.min ? String(item.min) : "");
                    setLocalMax(item.max ? String(item.max) : "");
                    setMinPrice(item.min);
                    setMaxPrice(item.max);
                  }}
                  className={`px-3 py-1.5 rounded-full border ${active ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"}`}
                  style={shadow}
                >
                  <Text
                    className={`text-xs font-medium ${active ? "text-blue-600" : "text-gray-500"}`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View className="px-5 pb-8 bg-white border-t border-gray-100">
          <TouchableOpacity
            onPress={handleApply}
            className="items-center py-4 bg-blue-600 rounded-2xl"
            style={{
              shadowColor: "#2563eb",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="text-base font-bold text-white">
              Apply Filters {activeCount > 0 ? `(${activeCount})` : ""}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

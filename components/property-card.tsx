import { useSavedProperty } from "@/hooks/useSavedProperty";
import { formatPrice } from "@/lib/utils";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function PropertyCard({
  property,
  onUnsave,
  showSave,
}: {
  property: Property;
  onUnsave?: () => void;
  showSave?: boolean;
}) {
  const router = useRouter();
  const { isSaved, saveLoading, toggleSave } = useSavedProperty({
    propertyId: property.id,
    onUnsave: onUnsave,
  });

  return (
    <TouchableOpacity
      className="flex-row mb-4 overflow-hidden bg-white rounded-2xl"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        opacity: property.is_sold ? 0.5 : 1,
      }}
      onPress={() => router.push(`/(root)/property/${property.id}`)}
    >
      <Image
        source={{ uri: property.images[0] }}
        className="w-28 h-28"
        resizeMode="cover"
      />

      <View className="justify-between flex-1 p-3">
        <View>
          <Text
            className="mb-1 text-sm font-bold text-gray-800"
            numberOfLines={1}
          >
            {property.title}
          </Text>

          <View className="flex-row items-center gap-1">
            <Ionicons name="location-outline" size={11} color="#6b7280" />
            <Text className="text-xs text-gray-500" numberOfLines={1}>
              {property.city}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-bold text-blue-600">
            {formatPrice(property.price)}
          </Text>

          {property.is_sold && (
            <View className="bg-red-50 px-2 py-0.5 rounded-full">
              <Text className="text-xs font-semibold text-red-500">Sold</Text>
            </View>
          )}

          <View className="flex-row gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="bed-outline" size={11} color="#6b7280" />
              <Text className="text-xs text-gray-500">
                {property.bedrooms} bd
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Ionicons name="expand-outline" size={11} color="#6b7280" />
              <Text className="text-xs text-gray-500">
                {property.area_sqft} ft²
              </Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity
        className="items-center w-10 pt-3"
        onPress={toggleSave}
        disabled={saveLoading}
      >
        <Ionicons
          name={isSaved ? "heart" : "heart-outline"}
          size={18}
          color={isSaved ? "#ef4444" : "#9ca3af"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

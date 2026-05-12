import PropertyCard from "@/components/property-card";
import { useSupabase } from "@/hooks/useSupabase";
import { Property } from "@/types";
import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SavedProperty {
  id: string;
  property_id: string;
  properties: Property;
}

export default function SavedScreen() {
  const { userId } = useAuth();
  const authSupbase = useSupabase();
  const router = useRouter();

  const [saved, setSaved] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSaved = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data } = await authSupbase
        .from("saved_properties")
        .select("id, property_id, properties(*)")
        .eq("user_clerk_id", userId)
        .order("id", { ascending: false });

      setSaved((data as unknown as SavedProperty[]) ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchSaved();
    }, [fetchSaved]),
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-5 pt-4 pb-3">
        <Text className="text-2xl font-bold text-gray-900">Saved</Text>
        {!loading && (
          <Text className="mt-1 text-sm text-gray-400">
            {saved.length} {saved.length === 1 ? "property" : "properties"}{" "}
            Saved
          </Text>
        )}
      </View>

      {loading ? (
        <View className="items-center justify-center flex-1">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={saved}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PropertyCard
              property={item.properties}
              onUnsave={() =>
                setSaved((prev) => prev.filter((s) => s.id !== item.id))
              }
              showSave
            />
          )}
          ListEmptyComponent={
            <View className="items-center justify-center flex-1 py-24">
              <View className="items-center justify-center w-20 h-20 mb-4 rounded-full bg-red-50">
                <Ionicons name="heart-outline" size={36} color="#EF4444" />
              </View>
              <Text className="mb-1 text-lg font-bold text-gray-700">
                No Saved Properties
              </Text>
              <Text className="px-8 text-sm text-center text-gray-400">
                Tap the heart icon on any property to save it here
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

import { useAuth, useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignupPage() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const isLoading = fetchStatus === "fetching";

  const onSignupPress = async () => {
    const { error } = await signUp.password({
      emailAddress: email,
      password,
      firstName,
      lastName,
    });

    if (error) {
      console.error("Signup error:", error);
      return;
    }

    if (!error) {
      await signUp.verifications.sendEmailCode();
    }
  };

  const onVerifyPress = async () => {
    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    }
  };

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <View className="justify-center flex-1 px-6 py-12">
        <Image
          source={require("../../assets/images/kribb.png")}
          className="w-32 h-16 mb-8"
          resizeMode="contain"
        />
        <Text className="mb-2 text-3xl font-bold text-gray-800">
          Verify your account
        </Text>
        <Text className="mb-8 text-gray-500">
          We have sent a code to {email}
        </Text>

        <TextInput
          className="w-full px-4 py-3 border border-gray-300 rounded-xl"
          placeholder="Enter verification code"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
        />

        {errors?.fields?.code && (
          <Text className="mb-4 text-red-500">
            {errors?.fields?.code?.message}
          </Text>
        )}

        <TouchableOpacity
          disabled={isLoading}
          className="items-center w-full py-4 mb-4 bg-blue-600 rounded-xl"
          onPress={onVerifyPress}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-base font-bold text-white">Verify</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          disabled={isLoading}
          className="py-2"
          onPress={() => signUp.verifications.sendEmailCode()}
        >
          <Text className="text-blue-600">I need a new code</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-white"
      keyboardShouldPersistTaps="handled"
    >
      <View className="justify-center flex-1 px-6 py-12">
        <Image
          source={require("../../assets/images/kribb.png")}
          className="w-32 h-16 mb-8"
          resizeMode="contain"
        />
        <Text className="mb-2 text-3xl font-bold text-gray-800">
          Create Account
        </Text>
        <Text className="mb-8 text-gray-500">Find your dream home today</Text>

        <View className="flex-row gap-3 mb-4">
          <TextInput
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl"
            placeholder="First name"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
            value={firstName}
            onChangeText={setFirstName}
          />

          <TextInput
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl"
            placeholder="Last name"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <TextInput
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl"
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        {errors?.fields?.emailAddress && (
          <Text className="mb-4 text-red-500">
            {errors?.fields?.emailAddress.message}
          </Text>
        )}

        <TextInput
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl"
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {errors?.fields?.password && (
          <Text className="mb-4 text-red-500">
            {errors?.fields?.password.message}
          </Text>
        )}

        <TouchableOpacity
          disabled={isLoading}
          className="items-center w-full py-4 mb-4 bg-blue-600 rounded-xl"
          onPress={onSignupPress}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-base font-bold text-white">Sign Up</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-gray-500">Already have an account? </Text>
          <Link href="/sign-in">
            <Text className="font-bold text-blue-600">Sign in</Text>
          </Link>
        </View>

        <View nativeID="clerk-captcha" />
      </View>
    </ScrollView>
  );
}

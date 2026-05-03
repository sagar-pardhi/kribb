import { useSignIn } from "@clerk/expo";
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

export default function SigninPage() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const isLoading = fetchStatus === "fetching";

  const onSigninPress = async () => {
    const { error } = await signIn.password({
      emailAddress: email,
      password,
    });

    if (error) {
      console.error("Signup error:", error);
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session.currentTask) {
            console.log(session?.currentTask);

            return;
          }

          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    } else if (signIn.status === "needs_second_factor") {
      await signIn.mfa.sendPhoneCode();
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.error("Unexpected sign-in status:", signIn.status);
    }
  };

  const onVerifyPress = async () => {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session.currentTask) {
            console.log(session?.currentTask);

            return;
          }

          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    }
  };

  if (signIn.status === "needs_client_trust") {
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
          onPress={() => signIn.mfa.sendEmailCode()}
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
          Welcome back
        </Text>
        <Text className="mb-8 text-gray-500">Sign in to your account</Text>

        <TextInput
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl"
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        {errors?.fields?.identifier && (
          <Text className="mb-4 text-red-500">
            {errors?.fields?.identifier?.message}
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
            {errors?.fields?.password?.message}
          </Text>
        )}

        <TouchableOpacity
          disabled={isLoading}
          className="items-center w-full py-4 mb-4 bg-blue-600 rounded-xl"
          onPress={onSigninPress}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-base font-bold text-white">Sign in</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-gray-500">Don&apos;t have an account? </Text>
          <Link href="/sign-up">
            <Text className="font-bold text-blue-600">Sign up</Text>
          </Link>
        </View>

        <View nativeID="clerk-captcha" />
      </View>
    </ScrollView>
  );
}

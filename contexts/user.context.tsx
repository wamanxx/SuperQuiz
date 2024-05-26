import * as React from "react";

import { Database } from "@/lib/database";
import { supabase } from '@/lib/supabase';

import { SignInWithPasswordCredentials, User } from "@supabase/supabase-js"

// "ADMIN" | "MODERATEUR" | "USER"
type UserRole = Database["public"]["Enums"]["roles"];

type UserProfile = Database["public"]["Tables"]["users_profiles"]["Row"];

interface UserContextInterface {
    user: undefined | null | User;
    profile: undefined | null | UserProfile;
    role: undefined | null | UserRole;
    isLoggedIn: boolean;
    isLoading: boolean;
    /*---*/
    login: (credentials: SignInWithPasswordCredentials) => Promise<{ user: User, profile: UserProfile, role: UserRole }>;
    signup: (credentials: SignInWithPasswordCredentials & { nom: string; prenom: string }) => Promise<{ user: User, profile: UserProfile, role: UserRole }>;
    logout: () => Promise<boolean>;
}

const DEFAULT_USER_CONTEXT: UserContextInterface = {
    profile: undefined,
    user: undefined,
    role: undefined,
    isLoggedIn: false,
    isLoading: false,
    login: async () => { throw new Error("UserContextProvider not initialized") },
    signup: async () => { throw new Error("UserContextProvider not initialized") },
    logout: async () => { throw new Error("UserContextProvider not initialized") },
}

export const UserContext = React.createContext<UserContextInterface>(DEFAULT_USER_CONTEXT);

interface UserContextProviderProps {
    children: React.ReactNode;
}

export const UserContextProvider = ({
    children
}: UserContextProviderProps) => {
    const [profile, setProfile] = React.useState<UserContextInterface["profile"]>(DEFAULT_USER_CONTEXT["profile"]);
    const [user, setUser] = React.useState<UserContextInterface["user"]>(DEFAULT_USER_CONTEXT["user"]);
    const [role, setRole] = React.useState<UserContextInterface["role"]>(DEFAULT_USER_CONTEXT["role"]);

    const [isLoggedIn, setIsLoggedIn] = React.useState<UserContextInterface["isLoggedIn"]>(false);

    const [isLoading, setIsLoading] = React.useState<UserContextInterface["isLoading"]>(false);

    const onMount = async () => {
        try {
            setIsLoading(true)

            const authentication = await supabase.auth.getUser();

            if (authentication.error || !authentication.data)
                throw authentication.error

            const user_ = authentication.data.user!;

            const profile_ = await getUserProfileByUserId(user_.id);

            const role_ = await getUserRoleByUserId(user_.id);

            // ---

            setUser(user_);
            setProfile(profile_);
            setRole(role_);

            setIsLoggedIn(true);
        } catch (error) {
            setUser(null);
            setProfile(null);
            setRole(null);

            setIsLoggedIn(false);
        } finally {
            setIsLoading(false)
        }
    };

    React.useEffect(() => {
        onMount();

        return () => { };
    }, []);

    const getUserProfileByUserId = async (userId: string) => {
        const { data, error } = await supabase.from("users_profiles").select("*").eq("user_id", userId).single();

        if (error)
            throw error;

        return data;
    }

    const getUserRoleByUserId = async (userId: string) => {
        const { data, error } = await supabase.from("users_roles").select("*").eq("user_id", userId).single()

        if (error)
            throw error;

        return data.role;
    }

    const login: UserContextInterface["login"] = async (credentials) => {
        try {
            setIsLoading(true);

            const authentication = await supabase.auth.signInWithPassword({
                ...credentials,
            });

            if (authentication.error || !authentication.data)
                throw authentication.error;

            const user_ = authentication.data.user!;

            const profile_ = await getUserProfileByUserId(user_.id);

            const role_ = await getUserRoleByUserId(user_.id);

            setProfile(profile_);
            setRole(role_);
            setUser(user_);

            setIsLoggedIn(true);


            return { user: user_, role: role_, profile: profile_ };
        } catch (error) {
            setProfile(null);
            setUser(null);
            setRole(null);

            setIsLoggedIn(false);

            throw error;
        } finally {
            setIsLoading(false);
        }

    };

    const signup: UserContextInterface["signup"] = async (credentials) => {
        const { nom, prenom } = credentials;
        try {
            setIsLoading(true);

            const authentication = await supabase.auth.signUp({
                ...credentials,
            });

            if (authentication.error || !authentication.data)
                throw authentication.error;

            const user_ = authentication.data.user!;


            const role_ = await getUserRoleByUserId(user_.id);


            const updateProfileData = async (userId: string, nom: string, prenom: string) => {
                try {
                    const { error } = await supabase
                        .from('users_profiles')
                        .update({ nom, prenom })
                        .eq('user_id', userId)

                    if (error) throw error

                    console.log('Profile mis à jour avec succès')
                } catch (error) {
                    console.error('Erreur lors de la mise à jour du profil:', error)
                }

            }//
            await updateProfileData(user_.id, nom, prenom)
            const profile_ = await getUserProfileByUserId(user_.id);
            setProfile(profile_);
            setUser(user_);
            setRole(role_);
            setIsLoggedIn(true);//

            return { user: user_, role: role_, profile: profile_ };
        } catch (error) {
            setProfile(null);
            setUser(null);
            setRole(null);

            setIsLoggedIn(false);

            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout: UserContextInterface["logout"] = async () => {
        try {
            setIsLoading(true)

            const response = await supabase.auth.signOut({
                scope: "global"
            })

            if (response.error)
                throw response.error;

            setProfile(null);
            setUser(null);
            setRole(null);

            setIsLoggedIn(false);

            return true;
        } catch (error) {
            setProfile(null);
            setUser(null);
            setRole(null);

            return false;
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <UserContext.Provider value={{
            profile,
            user,
            role,

            isLoggedIn,
            isLoading,

            login,
            logout,
            signup
        }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserContext = () => {
    const context = React.useContext(UserContext);

    if (!context)
        throw new Error("useUserContext must be used within a UserContextProvider.");

    return context;
}
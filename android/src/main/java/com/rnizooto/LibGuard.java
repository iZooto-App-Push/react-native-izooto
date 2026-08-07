package com.rnizooto;

public class LibGuard {
    public static boolean hasOneTapLibrary() {
        return checkLibraryClass("androidx.credentials.Credential")
                && checkLibraryClass("androidx.credentials.playservices.CredentialProviderPlayServicesImpl")
                && checkLibraryClass("com.google.android.libraries.identity.googleid.GetGoogleIdOption");
    }

    private static boolean checkLibraryClass(String className) {
        try {
            Class.forName(className);
            return true;
        } catch (ClassNotFoundException ex) {
            return false;
        }
    }

}

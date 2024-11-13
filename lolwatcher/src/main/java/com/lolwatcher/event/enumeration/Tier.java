package com.lolwatcher.event.enumeration;

public enum Tier {
    UNRANKED,
    IRON,
    BRONZE,
    SILVER,
    GOLD,
    PLATINUM,
    EMERALD,
    DIAMOND,
    MASTER,
    GRANDMASTER,
    CHALLENGER;

    public static Tier fromOrdinal(int ordinal) {
        Tier[] tiers = Tier.values();
        if (ordinal >= 0 && ordinal < tiers.length) {
            return tiers[ordinal];
        } else {
            throw new IllegalArgumentException("Invalid ordinal: " + ordinal);
        }
    }
}

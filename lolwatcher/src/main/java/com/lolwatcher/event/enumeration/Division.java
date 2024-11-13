package com.lolwatcher.event.enumeration;

import lombok.Getter;

@Getter
public enum Division implements Comparable<Division> {
    IV,
    III,
    II,
    I;

    public static Division fromOrdinal(int ordinal) {
        Division[] divisions = Division.values();
        if (ordinal >= 0 && ordinal < divisions.length) {
            return divisions[ordinal];
        } else {
            throw new IllegalArgumentException("Invalid ordinal: " + ordinal);
        }
    }
}


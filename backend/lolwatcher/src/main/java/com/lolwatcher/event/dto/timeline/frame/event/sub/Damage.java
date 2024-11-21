package com.lolwatcher.event.dto.timeline.frame.event.sub;


public record Damage(boolean basic,
                     int magicDamage,
                     String name,
                     int participantId,
                     int physicalDamage,
                     String spellName,
                     int spellSlot,
                     int trueDamage,
                     String type) {
}

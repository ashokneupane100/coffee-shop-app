import { StyleSheet, Appearance, Platform, SafeAreaView, ScrollView, FlatList, View, Text, Image, Dimensions, Pressable, Animated } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState, useEffect } from 'react';

import { Colors } from '@/constants/Colors';
import { MENU_ITEMS } from '@/constants/MenuItems';
import MENU_IMAGES from '@/constants/MenuImages';

// Get device width for responsive sizing
const { width, height } = Dimensions.get('window');
const cardWidth = Math.min(width * 0.95, 600);

// Current USD to NPR exchange rate (1 USD = approximately 135.04 NPR as of May 2025)
const USD_TO_NPR_RATE = 15.04;

export default function MenuScreen() {
    const colorScheme = Appearance.getColorScheme();
    const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
    const styles = createStyles(theme, colorScheme);
    const scrollY = useRef(new Animated.Value(0)).current;
    
    // Container adapted for platform
    const Container = Platform.OS === 'web' ? Animated.ScrollView : Animated.View;

    const renderFooter = () => (
        <Text style={styles.footerText}>• End of Menu •</Text>
    );

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Our Premium Coffee Selection</Text>
            <View style={styles.headerUnderline} />
        </View>
    );

    // Convert USD to NPR with formatting
    const formatNprPrice = (usdPrice) => {
        const nprPrice = usdPrice * USD_TO_NPR_RATE;
        return `रू ${nprPrice.toFixed(0)}`;
    };

    const MenuCard = ({ item, index }) => {
        // Animation values
        const scaleAnim = useRef(new Animated.Value(0.95)).current;
        const opacityAnim = useRef(new Animated.Value(0)).current;
        
        // Setup animation on mount
        useEffect(() => {
            // Slight delay based on item index for staggered effect
            const delay = index * 150;
            
            Animated.parallel([
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 600,
                    delay,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 8,
                    tension: 40,
                    delay,
                    useNativeDriver: true,
                })
            ]).start();
        }, []);

        // Press animation
        const [isPressed, setIsPressed] = useState(false);
        
        const handlePressIn = () => setIsPressed(true);
        const handlePressOut = () => setIsPressed(false);
        
        // Ensure we don't go out of bounds with the image array
        const imageIndex = (item.id - 1) % MENU_IMAGES.length;
        
        // Alternate layout for even/odd items
        const isEven = item.id % 2 === 0;
        
        // Calculate price in USD first, then convert to NPR
        const basePrice = 3 + (item.id % 3);
        
        return (
            <Animated.View 
                style={[
                    styles.cardContainer,
                    { 
                        opacity: opacityAnim,
                        transform: [{ scale: scaleAnim }],
                    }
                ]}
            >
                <Pressable 
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={({ pressed }) => [
                        styles.card,
                        pressed && styles.cardPressed
                    ]}
                >
                    {/* Background gradient */}
                    <LinearGradient
                        colors={colorScheme === 'dark' 
                            ? ['#2d2d2d', '#1a1a1a'] 
                            : ['#ffffff', '#f8f8f8']}
                        style={styles.cardGradient}
                    />
                    
                    {/* Card content with image and text */}
                    <View style={[
                        styles.cardContent,
                        isEven ? styles.cardContentEven : styles.cardContentOdd
                    ]}>
                        {/* Text content */}
                        <View style={styles.textContainer}>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Text style={styles.itemDescription}>{item.description}</Text>
                            <View style={styles.priceBadge}>
                                <Text style={styles.priceText}>{formatNprPrice(basePrice)}</Text>
                            </View>
                        </View>
                        
                        {/* Image with shadow and shine effect */}
                        <View style={styles.imageWrapper}>
                            {/* Animated shine effect */}
                            {isPressed && (
                                <Animated.View style={styles.shineEffect} />
                            )}
                            
                            <Animated.View style={[
                                styles.imageContainer,
                                { transform: [{ scale: isPressed ? 0.97 : 1 }] }
                            ]}>
                                <Image
                                    source={MENU_IMAGES[imageIndex]}
                                    style={styles.menuImage}
                                    resizeMode="cover"
                                />
                            </Animated.View>
                        </View>
                    </View>
                </Pressable>
            </Animated.View>
        );
    };

    if (Platform.OS === 'web') {
        return (
            <Container 
                style={styles.container}
                contentContainerStyle={styles.scrollContentContainer}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            >
                {renderHeader()}
                
                {MENU_ITEMS.map((item, index) => (
                    <MenuCard key={item.id} item={item} index={index} />
                ))}
                
                {renderFooter()}
            </Container>
        );
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <Animated.FlatList
                data={MENU_ITEMS}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => <MenuCard item={item} index={index} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContentContainer}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            />
        </SafeAreaView>
    );
}

function createStyles(theme, colorScheme) {
    const isDark = colorScheme === 'dark';
    
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
        },
        scrollContentContainer: {
            paddingHorizontal: 16,
            paddingBottom: 40,
            paddingTop: 15,
            alignItems: 'center',
        },
        headerContainer: {
            width: '100%',
            alignItems: 'center',
            paddingTop: 10,
            paddingBottom: 20,
            marginBottom: 10,
        },
        headerTitle: {
            fontSize: 28,
            fontWeight: 'bold',
            color: theme.text,
            textAlign: 'center',
            fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
            paddingHorizontal: 20,
        },
        headerUnderline: {
            height: 3,
            width: 80,
            backgroundColor: isDark ? '#ffb347' : '#8a5a44',
            marginTop: 10,
            borderRadius: 2,
        },
        footerText: {
            color: theme.text,
            textAlign: 'center',
            fontSize: 16,
            marginTop: 30,
            marginBottom: 20,
            fontStyle: 'italic',
            opacity: 0.7,
        },
        
        // Card container for animations
        cardContainer: {
            width: cardWidth,
            marginBottom: 25,
            alignSelf: 'center',
        },
        
        // Card styles
        card: {
            width: '100%',
            minHeight: 180,
            borderRadius: 24,
            overflow: 'hidden',
            elevation: 8, // Android shadow
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: isDark ? 0.6 : 0.25,
            shadowRadius: 10,
            position: 'relative',
            borderWidth: isDark ? 1 : 0,
            borderColor: isDark ? '#444' : 'transparent',
        },
        cardPressed: {
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.3 : 0.15,
            elevation: 3,
        },
        cardGradient: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        },
        cardContent: {
            flexDirection: 'row',
            padding: 20,
            paddingVertical: 24,
        },
        cardContentEven: {
            flexDirection: 'row-reverse',
        },
        cardContentOdd: {
            flexDirection: 'row',
        },
        
        // Text styles
        textContainer: {
            flex: 1,
            justifyContent: 'center',
            paddingHorizontal: 12,
            maxWidth: '60%',
        },
        itemTitle: {
            fontSize: 26,
            fontWeight: 'bold',
            color: isDark ? '#f5f5f5' : '#333333',
            marginBottom: 12,
        },
        itemDescription: {
            fontSize: 16,
            color: theme.text,
            opacity: 0.85,
            lineHeight: 22,
        },
        priceBadge: {
            marginTop: 16,
            backgroundColor: isDark ? '#ffb347' : '#8a5a44',
            alignSelf: 'flex-start',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
        },
        priceText: {
            color: isDark ? '#222' : '#fff',
            fontWeight: 'bold',
            fontSize: 16,
        },
        
        // Image container and effects
        imageWrapper: {
            position: 'relative',
            width: 170,
            height: 170,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'visible',
        },
        imageContainer: {
            width: 160,
            height: 160,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 10,
            backgroundColor: isDark ? '#222' : '#fff',
            borderWidth: 3,
            borderColor: isDark ? '#444' : '#f0f0f0',
        },
        menuImage: {
            width: 150,
            height: 150,
            borderRadius: 15,
        },
        shineEffect: {
            position: 'absolute',
            top: -10,
            left: -10,
            right: -10,
            bottom: -10,
            backgroundColor: 'rgba(255,255,255,0.1)',
            zIndex: 5,
            borderRadius: 25,
        }
    });
}
import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Chip from '@mui/joy/Chip';
import IconButton from '@mui/joy/IconButton';
import Link from '@mui/joy/Link';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FmdGoodRoundedIcon from '@mui/icons-material/FmdGoodRounded';
import KingBedRoundedIcon from '@mui/icons-material/KingBedRounded';
import WifiRoundedIcon from '@mui/icons-material/WifiRounded';
import Star from '@mui/icons-material/Star';

type RentalCardProps = {
    postId: string;
    category: React.ReactNode;
    location: string;
    image: string;
    liked?: boolean;
    rareFind?: boolean;
    title: React.ReactNode;
    price: string;
    start_date: string;
    end_date: string;
    numberOfNights: number;
    pricePerNight: string;
    is_bookable: boolean;
};

export default function RentalCard(props: RentalCardProps) {
    const {
        postId,
        category,
        title,
        location,
        rareFind = false,
        liked = false,
        image,
        start_date,
        end_date,
        numberOfNights,
        price,
        pricePerNight,
        is_bookable
    } = props;
    const [isLiked, setIsLiked] = React.useState(liked);

    function formatDate(dateString?: string): string {
        if (!dateString) return '';
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    return (
        <Card
            variant="outlined"
            orientation="horizontal"
            sx={{
                bgcolor: 'neutral.softBg',
                display: 'flex',
                flexDirection: {xs: 'column', sm: 'row'},
                '&:hover': {
                    boxShadow: 'lg',
                    borderColor: 'var(--joy-palette-neutral-outlinedDisabledBorder)',
                },
            }}
        >
            <CardOverflow
                sx={{
                    mr: {xs: 'var(--CardOverflow-offset)', sm: 0},
                    mb: {xs: 0, sm: 'var(--CardOverflow-offset)'},
                    '--AspectRatio-radius': {
                        xs: 'calc(var(--CardOverflow-radius) - var(--variant-borderWidth, 0px)) calc(var(--CardOverflow-radius) - var(--variant-borderWidth, 0px)) 0 0',
                        sm: 'calc(var(--CardOverflow-radius) - var(--variant-borderWidth, 0px)) 0 0 calc(var(--CardOverflow-radius) - var(--variant-borderWidth, 0px))',
                    },
                }}
            >
                <AspectRatio
                    ratio="1"
                    flex
                    sx={{
                        minWidth: {sm: 120, md: 160},
                        '--AspectRatio-maxHeight': {xs: '160px', sm: '9999px'},
                    }}
                >
                    <img alt="" src={image}/>
                    <Stack
                        alignItems="center"
                        direction="row"
                        sx={{position: 'absolute', top: 0, width: '100%', p: 1}}
                    >
                        {rareFind && (
                            <Chip
                                variant="soft"
                                color="success"
                                startDecorator={<WorkspacePremiumRoundedIcon/>}
                                size="md"
                            >
                                Rare find
                            </Chip>
                        )}
                        <IconButton
                            variant="plain"
                            size="sm"
                            color={isLiked ? 'danger' : 'neutral'}
                            onClick={() => setIsLiked((prev) => !prev)}
                            sx={{
                                display: {xs: 'flex', sm: 'none'},
                                ml: 'auto',
                                borderRadius: '50%',
                                zIndex: '20',
                            }}
                        >
                            <FavoriteRoundedIcon/>
                        </IconButton>
                    </Stack>
                </AspectRatio>
            </CardOverflow>
            <CardContent>
                <Stack
                    spacing={1}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                >
                    <div>
                        <Typography level="body-sm">{category}</Typography>
                        <Typography level="title-md">
                            <Link
                                overlay
                                disabled={!is_bookable}
                                underline="none"
                                href={`/post/${postId}`}
                                sx={{color: 'text.primary', width: '100%'}}
                            >
                                {title}
                            </Link>
                        </Typography>
                    </div>
                    <IconButton
                        variant="plain"
                        size="sm"
                        color={isLiked ? 'danger' : 'neutral'}
                        onClick={() => setIsLiked((prev) => !prev)}
                        sx={{
                            display: {xs: 'none', sm: 'flex'},
                            borderRadius: '50%',
                        }}
                    >
                        <FavoriteRoundedIcon/>
                    </IconButton>
                </Stack>
                <Stack
                    spacing="0.25rem 1rem"
                    direction="row"
                    useFlexGap
                    flexWrap="wrap"
                    sx={{my: 0.25}}
                >
                    <Typography level="body-xs" startDecorator={<FmdGoodRoundedIcon/>}>
                        {location}
                    </Typography>
                    <Typography level="body-xs" startDecorator={<KingBedRoundedIcon/>}>
                        1 bed
                    </Typography>
                    <Typography level="body-xs" startDecorator={<WifiRoundedIcon/>}>
                        Wi-Fi
                    </Typography>
                </Stack>

                <Stack direction="row" sx={{mt: 2}}>
                    <Typography>
                        <strong>{formatDate(start_date)} - {formatDate(end_date)}</strong>
                    </Typography>

                    <Typography level="title-lg" sx={{flexGrow: 1, textAlign: 'right'}}>

                        <Typography level="body-md"></Typography>
                        <strong>${pricePerNight}</strong><Typography level="body-md">/night</Typography>
                    </Typography>

                </Stack>
                <Stack direction="row" sx={{mt: 'auto'}}>
                    <Typography
                        level="title-sm"
                        startDecorator={
                            <React.Fragment>
                                <Star sx={{color: 'warning.400'}}/>
                                <Star sx={{color: 'warning.400'}}/>
                                <Star sx={{color: 'warning.400'}}/>
                                <Star sx={{color: 'warning.400'}}/>
                                <Star sx={{color: 'warning.200'}}/>
                            </React.Fragment>
                        }
                        sx={{display: 'flex', gap: 1}}
                    >
                        4.0
                    </Typography>
                    <Typography level="title-lg" sx={{flexGrow: 1, textAlign: 'right'}}>
                        <strong>${price}</strong> <Typography level="body-md">total</Typography>
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
}

<Box sx={{ padding: '20px' }}>
    <Typography variant="h5" gutterBottom>
        Dashboard Overview
    </Typography>
    <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h6">Certificates Issued</Typography>
                    <Typography variant="h4">120</Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12} md={4}>
            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h6">Certificates Verified</Typography>
                    <Typography variant="h4">95</Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12} md={4}>
            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h6">Certificates Shared</Typography>
                    <Typography variant="h4">80</Typography>
                </CardContent>
            </Card>
        </Grid>
    </Grid>
</Box>

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Card, Text, Title, Chip, List } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

export default function DisputeDetailsScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { dispute } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{t('disputeId', { id: dispute.id })}</Title>
          <Text>{t('regardingBatch', { batchId: dispute.batchId })}</Text>
          <Chip icon="information" style={styles.chip}>{dispute.status}</Chip>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <List.Section>
            <List.Subheader>{t('disputeDetails')}</List.Subheader>
            <List.Item
              title={t('reasonForDispute')}
              description={dispute.reason}
              left={() => <List.Icon icon="alert-circle-outline" />}
            />
            <List.Item
              title={t('dateRaised')}
              description={dispute.date}
              left={() => <List.Icon icon="calendar" />}
            />
            <List.Item
              title={t('raisedBy')}
              description={dispute.raisedBy}
              left={() => <List.Icon icon="account-arrow-up" />}
            />
          </List.Section>
        </Card.Content>
      </Card>
      
      {dispute.status === 'Pending Review' && (
        <View style={styles.actions}>
            <Button mode="contained" onPress={() => console.log('Resolve Dispute')}>
                {t('resolve')}
            </Button>
            <Button mode="outlined" onPress={() => console.log('Add Comment')}>
                {t('addComment')}
            </Button>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  card: { marginBottom: 15 },
  chip: { alignSelf: 'flex-start', marginTop: 10 },
  actions: { 
      flexDirection: 'row', 
      justifyContent: 'space-around',
      marginTop: 20,
    },
});

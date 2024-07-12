import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Button, Dimensions, ImageBackground } from "react-native";
import { CarePlan } from "../model/FHIR/CarePlan";
import { Device } from "../model/FHIR/Device";
import { ExplanationOfBenefit } from "../model/FHIR/ExplanationOfBenefit";
import { Claim } from "../model/FHIR/Claim";
import { Condition } from "../model/FHIR/Condition";
import { Encounter } from "../model/FHIR/Encounter";
import { Patient } from "../model/FHIR/Patient";
import { AllergyIntolerance } from "../model/FHIR/AllergyIntollerance";
import { Observation } from "../model/FHIR/Observation";
import { MedicationRequest } from "../model/FHIR/MedicationRequest";
import { Procedure } from "../model/FHIR/Procedure";
import { Immunization } from "../model/FHIR/Immunization";
import { DiagnosticReport } from "../model/FHIR/DiagnosticReport";

const resourceImages = {
  Patient: require('../../assets/patient.png'),
  Encounter: require('../../assets/encounter.png'),
  Condition: require('../../assets/condition.png'),
  Claim: require('../../assets/claim.png'),
  ExplanationOfBenefit: require('../../assets/explanation_of_benefit.png'),
  CarePlan: require('../../assets/care_plan.png'),
  Device: require('../../assets/device.png'),
  AllergyIntolerance: require('../../assets/allergy.png'),
  SupplyDelivery: require('../../assets/supply.png'),
  MedicationRequest: require('../../assets/medication.png'),
  Observation: require('../../assets/observation.png'),
  Procedure: require('../../assets/procedure.png'),
  Immunization: require('../../assets/immunization.png'),
  DiagnosticReport: require('../../assets/diagnostic_report.png'),
};

const backgroundImage = require('../../assets/background.jpg');

const ProfileScreen = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedResourceType, setSelectedResourceType] = useState(null);
  const [resourceTypes, setResourceTypes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadFHIRData = async () => {
      try {
        const patientData = require('../../assets/patient.json');
        setData(patientData.entry);
        // setFilteredData(patientData.entry);
        setData(patientData.entry);

        const types = [...new Set(patientData.entry.map((entry: { resource: { resourceType: any; }; }) => entry.resource.resourceType))];
        setResourceTypes(types);
      } catch (error) {
        console.error('Error loading FHIR data', error);
      }
    };

    loadFHIRData();
  }, []);

  const filterData = (resourceType: string, query: string) => {
    let filtered = data;
    if (resourceType) {
      filtered = filtered.filter(entry => entry.resource.resourceType === resourceType);
    }
    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      filtered = filtered.filter(entry => {
        const resource = entry.resource;
        return (
          resource.resourceType.toLowerCase().includes(lowerCaseQuery) ||
          (resource.code && resource.code.text && resource.code.text.toLowerCase().includes(lowerCaseQuery)) ||
          (resource.type && resource.type.some((type: { text: string; }) => type.text && type.text.toLowerCase().includes(lowerCaseQuery)))
        );
      });
    }
    setFilteredData(filtered);
  };

  const handleResourceTypeClick = (type: string | React.SetStateAction<null>) => {
    setSelectedResourceType(type as React.SetStateAction<null>);
    filterData(type as string, searchQuery);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: any }) => {
    const resource = item.resource;
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>{resource.resourceType}</Text>
        {resource.resourceType === 'Patient' && renderPatient(resource)}
        {resource.resourceType === 'Encounter' && renderEncounter(resource)}
        {resource.resourceType === 'Condition' && renderCondition(resource)}
        {resource.resourceType === 'Claim' && renderClaim(resource)}
        {resource.resourceType === 'ExplanationOfBenefit' && renderExplanationOfBenefit(resource)}
        {resource.resourceType === 'CarePlan' && renderCarePlan(resource)}
        {resource.resourceType === 'Device' && renderDevice(resource)}
        {resource.resourceType === 'AllergyIntolerance' && renderAllergyIntolerance(resource)}
        {resource.resourceType === 'Observation' && renderObservation(resource)}
        {resource.resourceType === 'MedicationRequest' && renderMedicationRequest(resource)}
        {resource.resourceType === 'Procedure' && renderProcedure(resource)}
        {resource.resourceType === 'Immunization' && renderImmunization(resource)}
        {resource.resourceType === 'DiagnosticReport' && renderDiagnosticReport(resource)}
        {/* Add more cases for other resource types as needed */}
      </View>
    );
  };

  const renderPatient = (resource: Patient) => (
    <View>
      <Text>ID: {resource.id}</Text>
      <Text>Name: {resource.name?.[0]?.given?.join(" ") ?? ''} {resource.name?.[0]?.family ?? ''}</Text>
      <Text>Gender: {resource.gender}</Text>
      <Text>Birth Date: {resource.birthDate}</Text>
      <Text>Phone: {resource.telecom?.[0]?.value ?? ''}</Text>
      <Text>Address: {resource.address?.[0]?.line?.join(", ") ?? ''}, {resource.address?.[0].city}, {resource.address?.[0].state}, {resource.address?.[0].postalCode}, {resource.address?.[0].country}</Text>
      <Text>Race: {resource.extension?.find(ext => ext.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race")?.extension?.find(ext => ext.url === "text")?.valueString}</Text>
      <Text>Ethnicity: {resource.extension?.find(ext => ext.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity")?.extension?.find(ext => ext.url === "text")?.valueString}</Text>
      <Text>Mother's Maiden Name: {resource.extension?.find(ext => ext.url === "http://hl7.org/fhir/StructureDefinition/patient-mothersMaidenName")?.valueString}</Text>
      <Text>Language: {resource.communication?.[0].language.text}</Text>
    </View>
  );

  const renderEncounter = (resource: Encounter) => (
    <View>
      <Text>ID: {resource.id}</Text>
      <Text>Status: {resource.status}</Text>
      <Text>Class: {resource.class.code}</Text>
      <Text>Type: {resource.type?.[0].text}</Text>
      <Text>Participant: {resource.participant?.[0].individual?.display}</Text>
      <Text>Period: {new Date(resource.period?.start ?? '').toLocaleString()} - {new Date(resource.period?.end ?? '').toLocaleString()}</Text>
      <Text>Service Provider: {resource.serviceProvider?.display}</Text>
    </View>
  );

  const renderCondition = (resource: Condition) => (
    <View>
      <Text>ID: {resource.id}</Text>
      <Text>Clinical Status: {resource.clinicalStatus}</Text>
      <Text>Verification Status: {resource.verificationStatus}</Text>
      <Text>Condition: {resource.code?.text}</Text>
      <Text>Code: {resource.code?.coding?.[0].code}</Text>
      <Text>System: {resource.code?.coding?.[0].system}</Text>
      <Text>Patient: {resource.subject.reference}</Text>
      <Text>Context: {resource.context?.reference}</Text>
      <Text>Onset Date: {new Date(resource.onsetDateTime ?? '').toLocaleString()}</Text>
      <Text>Asserted Date: {new Date(resource.assertedDate ?? '').toLocaleString()}</Text>
    </View>
  );

  const renderObservation = (resource: Observation) => (
    <View>
      <Text>ID: {resource.id}</Text>
      <Text>Status: {resource.status}</Text>
      <Text>Category: {resource.category?.[0]?.coding?.[0].display}</Text>
      <Text>Code: {resource.code.text}</Text>
      <Text>System: {resource.code?.coding?.[0].system}</Text>
      <Text>Code: {resource.code?.coding?.[0].code}</Text>
      <Text>Patient: {resource.subject.reference}</Text>
      <Text>Context: {resource.context?.reference}</Text>
      <Text>Effective Date: {new Date(resource.effectiveDateTime ?? '').toLocaleString()}</Text>
      <Text>Issued Date: {new Date(resource.issued ?? '').toLocaleString()}</Text>
      <Text>Value: {resource.valueQuantity?.value} {resource.valueQuantity?.unit}</Text>
    </View>
  );

  const renderMedicationRequest = (resource: MedicationRequest) => (
    <View>
      <Text>ID: {resource.id}</Text>
      <Text>Status: {resource.status}</Text>
      <Text>Intent: {resource.intent}</Text>
      <Text>Medication: {resource.medicationCodeableConcept.text}</Text>
      <Text>Medication Code: {resource.medicationCodeableConcept?.coding?.[0].code}</Text>
      <Text>System: {resource.medicationCodeableConcept?.coding?.[0].system}</Text>
      <Text>Patient: {resource.subject.reference}</Text>
      <Text>Context: {resource.context?.reference}</Text>
      <Text>Authored On: {new Date(resource.authoredOn ?? '').toLocaleString()}</Text>
      <Text>Requester: {resource.requester?.agent.display}</Text>
      <Text>Requester On Behalf Of: {resource.requester?.onBehalfOf?.display}</Text>
      {resource.reasonReference && resource.reasonReference?.length > 0 && (
        <Text>Reason Reference: {resource.reasonReference[0].reference}</Text>
      )}
      {resource.dosageInstruction && resource.dosageInstruction.length > 0 && (
        <View>
          <Text>Dosage Instruction:</Text>
          <Text>  Sequence: {resource.dosageInstruction[0].sequence}</Text>
          <Text>  Frequency: {resource.dosageInstruction[0].timing?.repeat?.frequency} times every {resource.dosageInstruction[0].timing?.repeat?.period} {resource.dosageInstruction[0].timing?.repeat?.periodUnit}</Text>
          <Text>  As Needed: {resource.dosageInstruction[0].asNeededBoolean ? 'Yes' : 'No'}</Text>
          <Text>  Dose Quantity: {resource.dosageInstruction[0].doseQuantity?.value}</Text>
        </View>
      )}
    </View>
  );

  const renderProcedure = (resource: Procedure) => (
    <View>
      <Text>ID: {resource.id}</Text>
      <Text>Status: {resource.status}</Text>
      <Text>Procedure: {resource.code.text}</Text>
      <Text>Code: {resource.code.coding?.[0].code}</Text>
      <Text>System: {resource.code.coding?.[0].system}</Text>
      <Text>Patient: {resource.subject.reference}</Text>
      <Text>Context: {resource.context?.reference}</Text>
      <Text>Performed Period: {new Date(resource.performedPeriod?.start ?? '').toLocaleString()} - {new Date(resource.performedPeriod?.end ?? '').toLocaleString()}</Text>
    </View>
  );

  const renderImmunization = (resource: Immunization) => (
    <View>
      <Text>ID: {resource.id}</Text>
      <Text>Status: {resource.status}</Text>
      <Text>Vaccine: {resource.vaccineCode.text}</Text>
      <Text>Vaccine Code: {resource.vaccineCode.coding?.[0].code}</Text>
      <Text>System: {resource.vaccineCode.coding?.[0].system}</Text>
      <Text>Patient: {resource.patient.reference}</Text>
      <Text>Encounter: {resource.encounter?.reference}</Text>
      <Text>Date: {new Date(resource.date ?? '').toLocaleString()}</Text>
      <Text>Primary Source: {resource.primarySource ? 'Yes' : 'No'}</Text>
      <Text>Not Given: {resource.notGiven ? 'Yes' : 'No'}</Text>
    </View>
  );

  const renderDiagnosticReport = (resource: DiagnosticReport) => (
    <View>
      <Text>ID: {resource.id}</Text>
      <Text>Status: {resource.status}</Text>
      <Text>Report: {resource.code.text}</Text>
      <Text>Code: {resource.code.coding?.[0].code}</Text>
      <Text>System: {resource.code.coding?.[0].system}</Text>
      <Text>Patient: {resource.subject.reference}</Text>
      <Text>Context: {resource.context?.reference}</Text>
      <Text>Effective Date: {new Date(resource.effectiveDateTime ?? '').toLocaleString()}</Text>
      <Text>Issued Date: {new Date(resource.issued ?? '').toLocaleString()}</Text>
      {resource.result && resource.result.length > 0 && (
        <View>
          <Text>Results:</Text>
          {resource.result.map((result, index) => (
            <Text key={index}>  - {result.display}</Text>
          ))}
        </View>
      )}
    </View>
  );

  const renderClaim = (resource: Claim) => (
    <View>
      <Text>ID: {resource.id}</Text>
      <Text>Status: {resource.status}</Text>
      <Text>Use: {resource.use}</Text>
      <Text>Patient: {resource.patient.reference}</Text>
      <Text>Billable Period: {new Date(resource.billablePeriod?.start ?? '').toLocaleString()} - {new Date(resource.billablePeriod?.end ?? '').toLocaleString()}</Text>
      <Text>Organization: {resource.organization?.display}</Text>
      {resource.item && resource.item.length > 0 && (
        <View>
          <Text>Items:</Text>
          {resource.item.map((item, index) => (
            <View key={index}>
              <Text>  - Sequence: {item.sequence}</Text>
              {item.encounter && item.encounter.length > 0 && (
                <View>
                  <Text>    Encounters:</Text>
                  {item.encounter.map((enc, encIndex) => (
                    <Text key={encIndex}>      - {enc.reference}</Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
      <Text>Total: {resource.total?.value} {resource.total?.code}</Text>
    </View>
  );

  const renderExplanationOfBenefit = (resource: ExplanationOfBenefit) => (
    <View>
      <Text>ID: {resource.id}</Text>
      <Text>Status: {resource.status}</Text>
      <Text>Type: {resource.type?.coding?.map(coding => coding.display).join(", ")}</Text>
      <Text>Patient: {resource.patient.reference}</Text>
      <Text>Provider: {resource.provider?.identifier?.value}</Text>
      <Text>Organization: {resource.organization?.identifier?.value ?? ''}</Text>
      <Text>Billable Period: {new Date(resource.billablePeriod?.start ?? '').toLocaleString()} - {new Date(resource.billablePeriod?.end ?? '').toLocaleString()}</Text>
      <Text>Total Cost: {resource.totalCost?.value} {resource.totalCost?.code}</Text>
      <Text>Payment Amount: {resource.payment?.amount.value} {resource.payment?.amount.code}</Text>
      <Text>Insurance: {resource.insurance?.coverage.reference}</Text>
      {resource.careTeam && resource.careTeam.length > 0 && (
        <View>
          <Text>Care Team:</Text>
          {resource.careTeam.map((member, index) => (
            <View key={index}>
              <Text>  - Provider: {member.provider?.identifier?.value}</Text>
              <Text>    Role: {member.role?.coding?.[0].display}</Text>
            </View>
          ))}
        </View>
      )}
      {resource.item && resource.item.length > 0 && (
        <View>
          <Text>Items:</Text>
          {resource.item.map((item, index) => (
            <View key={index}>
              <Text>  - Location: {item.locationCodeableConcept?.coding?.[0].display}</Text>
              <Text>    Quantity: {item.extension?.[0].valueMoney?.value ?? ''}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderCarePlan = (resource: CarePlan) => (
    <View>
      <Text style={styles.itemTitle}>Care Plan Information</Text>
      <Text>ID: {resource.id}</Text>
      <Text>Status: {resource.status}</Text>
      <Text>Intent: {resource.intent}</Text>
      <Text>Category: {resource.category?.[0].text}</Text>
      <Text>Category Code: {resource.category?.[0].coding?.[0].code}</Text>
      <Text>System: {resource.category?.[0].coding?.[0].system}</Text>
      <Text>Patient: {resource.subject.reference}</Text>
      <Text>Context: {resource.context?.reference}</Text>
      <Text>Start Period: {new Date(resource.period?.start ?? '').toLocaleString()}</Text>
      {resource.activity && resource.activity.length > 0 && (
        <View>
          <Text>Activities:</Text>
          {resource.activity.map((activity, index) => (
            <View key={index}>
              <Text>  - {activity.detail?.code?.text}</Text>
              <Text>    Status: {activity.detail?.status}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderDevice = (resource: Device) => (
    <View>
      <Text style={styles.itemTitle}>Device Information</Text>
      <Text>ID: {resource.id}</Text>
      <Text>Status: {resource.status}</Text>
      <Text>Type: {resource.type?.text}</Text>
      <Text>Device Identifier: {resource.udi?.deviceIdentifier}</Text>
      <Text>Carrier HRF: {resource.udi?.carrierHRF}</Text>
      <Text>Lot Number: {resource.lotNumber}</Text>
      <Text>Manufacture Date: {new Date(resource.manufactureDate ?? '').toLocaleDateString()}</Text>
      <Text>Expiration Date: {new Date(resource.expirationDate ?? '').toLocaleDateString()}</Text>
      <Text>Patient: {resource.patient?.reference}</Text>
    </View>
  );

  const renderAllergyIntolerance = (resource: AllergyIntolerance) => (
    <>
      <Text>Clinical Status: {resource.clinicalStatus}</Text>
      <Text>Verification Status: {resource.verificationStatus}</Text>
      <Text>Type: {resource.type}</Text>
      <Text>Category: {resource.category.join(', ')}</Text>
      {resource.criticality && <Text>Criticality: {resource.criticality}</Text>}
      {resource.code && <Text>Code: {resource.code.text}</Text>}
      <Text>Patient: {resource.patient.display || resource.patient.reference}</Text>
      {resource.assertedDate && <Text>Asserted Date: {resource.assertedDate}</Text>}
    </>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <ScrollView contentContainerStyle={styles.buttonContainer}>
        {resourceTypes.map(type => (
          <TouchableOpacity
            key={type}
            style={[styles.button, selectedResourceType === type && styles.selectedButton]}
            onPress={() => handleResourceTypeClick(type)}
          >
            <Image source={resourceImages[type]} style={styles.buttonImage} />
            <Text style={styles.buttonText}>
            {type === "Patient" ? "Patient Info" :
             type === "Encounter" ? "Encounters" :
             type === "Condition" ? "Conditions" :
             type === "Claim" ? "Claims" :
             type === "ExplanationOfBenefit" ? "Benefits" :
             type === "CarePlan" ? "Care Plans" :
             type === "Device" ? "Devices" :
             type === "AllergyIntolerance" ? "Allergies" :
             type === "SupplyDelivery" ? "Sypply Deliveries" :
             type === "MedicationRequest" ? "Medication Requests" :
             type === "Observation" ? "Observations" :
             type === "Procedure" ? "Procedures" :
             type === "Immunization" ? "Immunizations" :
             type === "DiagnosticReport" ? "Diagnostic Reports" :
             type}
          </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <View style={styles.container}>
        {renderHeader()}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
            setSelectedResourceType(null);  // Reset selected resource type
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedResourceType}</Text>
              <ScrollView style={styles.modalScrollView}>
                {filteredData.map((item, index) => (
                  <View key={index} style={styles.itemContainer}>
                    {renderItem({ item })}
                  </View>
                ))}
              </ScrollView>
              <Button color="tomato" title="Close" onPress={() => {
                setModalVisible(false);
                setSelectedResourceType(null);  // Reset selected resource type
              }} />
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingTop: 40,
    // marginBottom: 80,
  },
  headerContainer: {
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    width: '45%',
    backgroundColor: 'tomato',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 4, // Shadow for Android (optional)
    shadowColor: "#000", // Shadow for iOS
    shadowOpacity: 0.3, // Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
  },
  selectedButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  buttonImage: {
    width: 50,
    height: 50,
  },
  itemContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: height * 0.9,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalScrollView: {
    marginBottom: 20,
  },
});

export default ProfileScreen;

 //   <View
  //     style={{
  //       flex: 1,
  //       alignItems: "center",
  //       paddingTop: 100,
  //       flexDirection: "column",
  //     }}
  //   >
  //     <Text style={{ fontSize: 30, fontWeight: "bold" }}>
  //       Hello {user.username}, {user.role}
  //     </Text>
  //     <View style={{ marginVertical: 10 }}>
  //       <Button onPress={() => handleUtilities()} title={"Utilities"} />
  //     </View>
  //     <View style={{ marginVertical: 10 }}>
  //       <Button onPress={() => handleLogout()} title={"Logout"} />
  //     </View>
  //   </View>
  // );

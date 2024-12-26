import React from 'react'
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { editSafetyCheckinAPI } from '../../Services/allAPI';
import { format } from "date-fns";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
function EditSafetyCheckin({ checkin, open, onOpenChange, onSave}) {
    const [checkinDetails, setCheckinDetails]=useState({
        time:"",
        note:""
    })

    // Function for handling edit safety checkin
    const handleEditCheckin=async(checkinId)=>{
        const token= sessionStorage.getItem('token')
        if(token){
          const reqHeader={
            "Authorization":`Bearer ${token}`
          }
          const reqBody={
            "time":checkinDetails.time,
            "note":checkinDetails.note
          }
          try {
            const response= await editSafetyCheckinAPI(checkinId,reqBody,reqHeader)
            console.log(response)
            if(response.status==200){
                const receivedCheckin=response.data.updatedCheckin
                console.log(receivedCheckin)
                const updatedCheckin={
                    ...receivedCheckin,
                    formattedTime:format(new Date(receivedCheckin.checkInTime),"HH:mm"),
                    formattedDate:format(new Date(receivedCheckin.checkInTime),"MMM d, yyyy")
                }
                alert("Safety Checkin Edited Successfully")
                onSave(updatedCheckin)
                onOpenChange(false)
                setCheckinDetails({time:"", note:""})

            }
          } catch (error) {
            console.log("Error while editing the safety checkin: ",error)
          }
        }
      }

    useEffect(() => {
        if (checkin) {
          setCheckinDetails({
            time:checkin.time,
            note:checkin.note
          });
        }
      }, [checkin]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Schedule New Check-in</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <label htmlFor="time">Time</label>
                        <Select
                          value={checkinDetails.time}
                          onValueChange={(value) =>
                            setCheckinDetails({ ...checkinDetails, time: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent className='bg-white'>
                            {Array.from({ length: 24 }, (_, i) => {
                              const hour = i.toString().padStart(2, "0");
                              return (
                                <SelectItem key={hour} value={`${hour}:00`}>
                                  {`${hour}:00`}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="note">Note (Optional)</label>
                        <Textarea
                          id="note"
                          value={checkinDetails.note}
                          onChange={(e) =>
                            setCheckinDetails({ ...checkinDetails, note: e.target.value })
                          }
                          placeholder="Add a note for this check-in"
                        />
                      </div>
                      <Button onClick={()=>handleEditCheckin(checkin._id)}>Schedule Check-in</Button>
                    </div>
                  </DialogContent>
                </Dialog>
  )
}

export default EditSafetyCheckin